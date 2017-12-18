// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

 //setup the login
    .state('login', {
     url: '/login',
     templateUrl: 'templates/login.html',
     controller: 'LoginCtrl'
  })
    
    .state('register', {
     url: '/register',
     templateUrl: 'templates/registrazione.html',
     controller: 'RegisterCtrl'
  })
  
    .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html',
    controller: 'AppCtrl'
    })

  .state('app.riepilogo', {
      url: '/riepilogo',
      views: {
      'menuContent': {
        templateUrl: 'templates/riepilogo.html',
        controller: 'SondaggiCtrl'
       }
      }
    })
    
    .state('app.account', {
      url: '/account',
      views: {
      'menuContent': {
        templateUrl: 'templates/account.html',
        controller: 'AccountCtrl'
       }
      }
    })
    
    .state('app.modifiche', {
      url: '/account/modifiche',
      views: {
      'menuContent': {
        templateUrl: 'templates/modifiche.html',
        controller: 'AccountCtrl'
       }
      }
    })

      .state('app.sondaggi', {
      url: '/sondaggi',
      views: {
        'menuContent': {
          templateUrl: 'templates/sondaggi.html',
          controller: 'SondaggiCtrl'
        }
      }
    })

  .state('app.sondaggio', {
    url: '/sondaggi/:sondaggioId',
    views: {
      'menuContent': {
        templateUrl: 'templates/sondaggio.html',
        controller: 'SondaggioCtrl'
      }
    }
  })
    
  .state('app.riepilogoSondaggio', {
    url: '/riepilogoSondaggio/:sondaggioId',
    views: {
      'menuContent': {
        templateUrl: 'templates/riepilogoSondaggio.html',
        controller: 'SondaggioCtrl'
      }
    }
  });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('login');
});
