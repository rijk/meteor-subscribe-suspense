Package.describe({
  name: 'rijk:react-subscribe-suspense',
  version: '0.0.1',
  summary: 'useSubscribe() hook with React Suspense support',
  git: 'https://github.com/rijk/meteor-subscribe-suspense',
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.11.1||2.0-beta.3');
  api.use('typescript');
  api.use('tracker');
	api.mainModule('use-subscription.ts', 'client', { lazy: true });
});