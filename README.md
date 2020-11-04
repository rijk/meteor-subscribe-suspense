This package is built on the amazingly small but wonderful [`use-asset`](https://github.com/pmndrs/use-asset) package.
It allows you to suspend while your a subscription is loading, and gives you powerful controls over when to load,
preload and unload your data.

> :warning: **Warning: this is experimental.** While it's used in real world projects, there are no tests yet, and it
currently only works on the client. If you like it, please contribute!


## useSubscribe with Suspense support

```tsx
import React, { Suspense } from 'react'
import useSubscription from 'meteor-subscribe-suspense'

function App() {
  return (
    <Suspense fallback={<b>Loading…</b>}>
      <Board id={123} />
    </Suspense>
  )
}

function Board({ id }) {
  useSubscription( 'board', id )
  // No need for ready checks; when you get here the subscription is ready
  return <div>Board {id}</div>
}
```

This is an example of basic usage; the `useSubscription` hook will initiate a subscription, which will suspend until
it's ready. The subscription will automatically close when the component unmounts, and any errors in the publication
will be thrown so they can be caught with an [Error Boundary](https://reactjs.org/docs/error-boundaries.html).

Using Suspense for this can make components lighter and easier to reason about, as you can read the code top down and
assume the needed data is there without having to do `ready()` checks.

### useSubscription hook source
The code for this hook is fairly simple:

```tsx
function useSubscription( name ...args ) {
  // This starts the subscription (if it is not preloaded yet)
  const { computation } = subscriptions.read( name, ...args )

  // This stops the subscription on unmount
  useEffect( () => () => {
    computation.stop()
  }, args )
}
```

This gives you a peak of how the `use-asset` API is used.

## Powerful control over your subscriptions

As this package keeps a cache of subscriptions (needed for Suspense), we can do some fun stuff. The cache is exposed
under a named export `subscriptions`, and accessing this opens the door for some powerful stuff.

### Keep subscription open after unmounting

There are cases where you wouldn't want to load data the user doesn't need, but after the user has requested it it's
more efficient to just keep it in memory instead of stopping/restarting the subscription as the user navigates through
the app.

An example could be a list with All Projects:

```tsx
import { subscriptions } from 'meteor-subscribe-suspense'

function AllProjects() {
  subscriptions.read( 'projects.all' )
  const projects = useCursor( () => Projects.find({}), [] )
  return (
    <div>
      {projects.map( project => (
        <Project key={project.id} project={project} />
      ) )}
    </div>
  )
}
```

I used `subscriptions.read` instead of `useSubscription` here (the function signature is the same). This _will_ suspend
the component the first time it is called, but _will not_ run the `useEffect` cleanup stopping the subscription.
Therefore, the next time this component is mounted it will render immediately, without delay. This is similar to
putting the subscription in a parent component, except that it's not initialized until the user requests the data the
first time.

You can even choose the best strategy per subscription:

```tsx
subscriptions.read( 'board', boardId ) // will be kept in memory
useSubscription( 'board.projects', boardId ) // will be stopped on unmount
```

### Preloading data

Similar to `.read()`, there's also a `.preload()` method, that will silently initiate a subscription. This can be
used to strategically preload data based on a user's actions:

```tsx
<NavLink
  to={`/board/${board.id}`}
  onMouseEnter={() => {
    subscriptions.preload( 'board', board.id )
  }}
>
  {board.name}
</NavLink>
```

…or place in the app and likely next step:

```tsx
function Welcome() {
  subscriptions.preload( 'dashboard' )

  return (
    <div>
      <p>Welcome back.</p>
      <NavLink to="/dashboard">Go to dashboard</NavLink>
    </div>
  )
}
```

You can also use this to initiate a subscription without suspending, more similar to `useTracker()`. This can be
useful when the subscription doesn't contain essential data and you can already render some UI.

```tsx
function Dashboard() {
  subscriptions.preload( 'dashboard.stats' ) // used .preload instead of .read
  const stats = useCursor( () => Stats.find({}), [] )

  // We can already render the page layout here, while the subscription loads
  return (
    <div>
      <nav />
      <main>
        {stats.map( stat => (
          <div key={stat.id}><b>{stat.title}: {stat.text}</div>
        ))}
      </main>
    </div>
  )
}
```

Doing this, you still keep the same benefits like preloading and choosing when to stop the subscription.
