import { createAsset } from 'use-asset'
import { Meteor } from 'meteor/meteor'
import { Tracker } from 'meteor/tracker'
import { useEffect } from 'react'

/**
 * Delay after unmounting before stopping computation and subscription — this is
 * mainly so new data can flow freely first
 */
const STOP_DELAY = 1000

export const subscriptions = createAsset( ( name, ...args ) => {
	return new Promise( ( resolve, reject ) => {
		if ( !name ) return resolve()

		// Prevent the computation being stopped automatically on React render
		Tracker.nonreactive( () => {
			Tracker.autorun( computation => {
				computation.onStop( () => subscriptions.clear( name, ...args ) )
				const onError = reject
				const subscription = Meteor.subscribe( name, ...args, { onError })
				if ( subscription.ready() ) resolve({ computation, subscription })
			})
		})
	})
})

type SubscriptionAsset = {
	computation: Tracker.Computation
	subscription: Meteor.SubscriptionHandle
}

export default function useSubscription(
	name?: string | false,
	...args: any[]
) {
	// This starts the subscription (if it is not preloaded yet)
	// eslint-disable-next-line max-len
	const { computation } = subscriptions.read( name, ...args ) as SubscriptionAsset

	// This stops the subscription on unmount (after delay)
	useEffect( () => () => {
		setTimeout( () => { computation.stop() }, STOP_DELAY )
	}, args )
}
