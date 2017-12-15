angular.module('starter.controllers', [])

//disabilita bottone indietro
.run(function ($ionicPlatform) {

        $ionicPlatform.registerBackButtonAction(function (event) {
            console.log($location.path());
            event.preventDefault();
        }, 100);
})

.controller('AppCtrl', function($scope, $state, $ionicHistory) {

    $scope.logOut = function(){

       $ionicHistory.clearCache().then(function() {
           $ionicHistory.clearHistory();
           $ionicHistory.nextViewOptions({ disableBack: true, historyRoot: true });
           $state.go('app.riepilogo');
           $state.go('login');
       })
    }

})

.controller('SondaggiCtrl', function($rootScope, $http) {

    $http.get('https://progettois.herokuapp.com/api/surveys')
        .success(function(data){
            $rootScope.sondaggi= data;

            var surveyIDS = [];
            angular.forEach($rootScope.sondaggi, function(value,key){
                surveyIDS.push(value.id);
            })

            $rootScope.sondaggiShow = []
            $rootScope.sondaggiRisposti = []
            for(let id in surveyIDS){
                $http.get('https://progettois.herokuapp.com/api/users/' + $rootScope.account.id + '/answers/' + surveyIDS[id])
                    .success(function(data){
                    //console.log(data)
                    if(data.length == 0){
                        angular.forEach($rootScope.sondaggi, function(value,key){
                            if(value.id == surveyIDS[id])
                                $rootScope.sondaggiShow.push(value);
                        })
                    }else{
                        angular.forEach($rootScope.sondaggi, function(value,key){
                            if(value.id == surveyIDS[id])
                                $rootScope.sondaggiRisposti.push(value);
                        })
                    }
                })
                    .error(function(data){
                    alert("Errore nel check delle risposte")
                });
            }


    })
        .error(function(data){
        alert("Errore nel caricamento dei sondaggi")
    });




    $rootScope.getSondaggioID = function(id){

        $http.get('https://progettois.herokuapp.com/api/surveys/' + id + '.json')
            .success(function(data){
                $rootScope.sondaggio = data
            })
            .error(function(data){
                console.log("Errore get sondaggio")
            })

        $http.get('https://progettois.herokuapp.com/api/surveys/' + id + '/questions.json')
        .success(function(data){
            $rootScope.domande= data;
            console.log(data)

            $rootScope.multiple = [];
            $rootScope.aperte = [];
            $rootScope.radio = [];
            angular.forEach($rootScope.domande, function(value, key){
                if(value.data.type.tipo == "aperta"){
                    $rootScope.aperte.push(value);
                }else if(value.data.type.max_answer == 1){
                    $rootScope.radio.push(value);
                }else{
                    $rootScope.multiple.push(value);
                }
            })



        })
        .error(function(data){
            alert("Errore nel caricamento del sondaggio")
        });
    }

    ///INiziare da qui

    $rootScope.getSondaggioInfo = function(id){

        var prova;


        var request = new XMLHttpRequest();
        request.open('GET', 'https://progettois.herokuapp.com/api/surveys/' + id + '/questions.json', false);  // `false` makes the request synchronous
        request.send(null);

        if (request.status === 200) {
          console.log(JSON.parse(request.responseText));
          prova = JSON.parse(request.responseText);
        }



        var domandeRiepilogo = {} ;
        var risposteRiepilogo = new Map()
        var arrayJsonRadio = [];
        var arrayJsonDom = [];
        var arrayDomandeAperte = [];


        var request = new XMLHttpRequest();
        request.open('GET', 'https://progettois.herokuapp.com/api/users/' + $rootScope.account.id + '/answers/' + id, false);  // `false` makes the request synchronous
        request.send(null);

        if (request.status === 200) {
          console.log(JSON.parse(request.responseText));
          datoest = JSON.parse(request.responseText);
        }

        angular.forEach(datoest, function(value, key){
            var jsonDomanda = {};
            jsonDomanda["id"] = value.survey_question_id;
            jsonDomanda["risposte"] = value.data.riposte;
            //jsonDomanda["domanda"] = "";
            risposteRiepilogo.set(value.survey_question_id,jsonDomanda);
            //arrayJsonDom.push(jsonDomanda);
            //risposteRiepilogo[value.survey_question_id] = value.data.riposte
            //console.log("question in " + value.survey_question_id);
            //console.log("array risposte " + value.data.riposte);
        })
        /*
        $http.get('https://progettois.herokuapp.com/api/users/' + $rootScope.account.id + '/answers/' + id, {priority:2})
        .success(function(data){
            if(data != undefined){
              console.log(data)
              $http.get('https://progettois.herokuapp.com/api/surveys/' + id + '/questions.json')
                  .success(function(data1, status){
                      console.log("ECCCO");
                      console.log(status)
                      console.log("loggo data1");
                      console.log(data1)
                      prova = data1

              }).error(function(data, status, headers, config){
                  console.log("Errore post risposte")
                  console.log(data)
                  console.log(status)
              })
              angular.forEach(data, function(value, key){
                  var jsonDomanda = {};
                  jsonDomanda["id"] = value.survey_question_id;
                  jsonDomanda["risposte"] = value.data.riposte;
                  //jsonDomanda["domanda"] = "";
                  risposteRiepilogo.set(value.survey_question_id,jsonDomanda);
                  //arrayJsonDom.push(jsonDomanda);
                  //risposteRiepilogo[value.survey_question_id] = value.data.riposte
                  //console.log("question in " + value.survey_question_id);
                  //console.log("array risposte " + value.data.riposte);
              })
              //risposteRiepilogo[data.survey_question_id] = data.data.riposte

            }
        })


        $http.get('https://progettois.herokuapp.com/api/surveys/' + data.survey_question_id + '/questions.json')
        .success(function(data1){
            angular.forEach(data1, function(value, key){
                domandeRiepilogo[value.id]= value.data.question;
            })
        })
        */
        //console.log("Stampo risposte riepilogo")
        //console.log(risposteRiepilogo)


        console.log("loggo prova");
        console.log(prova);
        if (prova == undefined){
          $http.get('https://progettois.herokuapp.com/api/surveys/' + id + '/questions.json',{priority:1})
              .success(function(data1, status){
                  console.log("ECCCO");
                  console.log(status)
                  console.log("loggo data1");
                  console.log(data1)
                  prova = data1

          }).error(function(data, status, headers, config){
              console.log("Errore post risposte")
              console.log(data)
              console.log(status)
          })
        }
        console.log("loggo prova");
        console.log(prova);
        /*
        angular.forEach(prova, function(value, key){
          console.log("jsdbjshdbvhjsdbv");
          console.log(arrayJsonDom);
          for(var d in arrayJsonDom){
            console.log("rootscopeid " + arrayJsonDom[d].id);
            console.log("valueid "+ value.id);
            if(arrayJsonDom[d].id == value.id){
              arrayJsonDom[d]["domanda"] = value.data.question;
            }
          }




          //domandeRiepilogo.set(value.id, value.data.question);
           //console.log("value id " + value.id);
           //console.log("data question " + value.data.question);
        })
        */
        console.log("Stampo risposte riepilogo1");
        console.log(risposteRiepilogo);
        angular.forEach(prova, function(value, key){
              console.log("id " + value.id);
              console.log(risposteRiepilogo.get(value.id));
              if(risposteRiepilogo.get(value.id) != undefined){
                var jsonhj = risposteRiepilogo.get(value.id);
                jsonhj.domanda = value.data.domanda;
                jsonhj.max_answer = value.data.type.max_answer;
                jsonhj.tipo = value.data.type.tipo;
                if(jsonhj.tipo == "opzioni"){
                  arrayJsonDom.push(jsonhj);
                } /*else if(jsonhj.max_answer == 1){
                  arrayJsonRadio.push(jsonhj);
                }*/ else {
                  arrayDomandeAperte.push(jsonhj);
                }

              }
        })
        $rootScope.arrayDomandeAperteRoot = arrayDomandeAperte;
        $rootScope.arrayJsonDomandeRisposte = arrayJsonDom;
        //$rootScope.arrayJsonRadio = arrayJsonRadio;
        //$rootScope.hashArrayDomandeRisposte = {"First Name": ["John", "chhh"], "Last Name":"Smith", "First Name33":"John", "Last Name44":"Smith"}
        console.log("qui");
        console.log(arrayJsonDom);
        console.log("Stampo array domande aperte");
        console.log($rootScope.arrayDomandeAperteRoot);
        /*
        for(var i in domandeRiepilogo){
          console.log(i)
          if(risposteRiepilogo[i] == undefined){
              $rootScope.hashArrayDomandeRisposte[domandeRiepilogo[i]] = "";
          }
          $rootScope.hashArrayDomandeRisposte[domandeRiepilogo[i]] = risposteRiepilogo[i];
        }
        for(var i in domandeRiepilogo){
          console.log("hajshajshdjahsd");
          console.log(i);
        }

        angular.forEach(domandeRiepilogo, function(value, key){
          console.log("provissima");
          console.log(value + " " + key);
        })

        console.log("Stampo domande riepilogo")
        console.log(domandeRiepilogo)

        console.log("Stampo hashmapProva")
        console.log($rootScope.hashArrayDomandeRisposte);
        */

    }

})

.controller('SondaggioCtrl', function($rootScope, $http, $state, $ionicPopup, $filter) {

    $rootScope.datiRisposte = [];

    $rootScope.clickSubmit = function(){

        var arrayprova = []
        for(let i in $rootScope.datiRisposte) {
            var dato = {"user_id": $rootScope.account.id};
            dato.survey_question_id = parseInt(i,10);
            dato.data = {"riposte": $rootScope.datiRisposte[i]}
            arrayprova.push(dato);
        }
        

        for(let d in arrayprova){
            $http.post('http://progettois.herokuapp.com/api/survey_answers.json', arrayprova[d])
            .success(function(data, status, headers, config){
                console.log("Risposta inviata")
                console.log(data)
                console.log(status)
            })
            .error(function(data, status, headers, config){
                console.log("Errore post risposte")
                console.log(arrayprova[d])
                console.log(data)
                console.log(status)
            })
        }

        var alertPopup = $ionicPopup.alert({
          title: 'Okay',
          template: 'Grazie per aver completato il nostro sondaggio'
        });
        alertPopup.then(function(res) {
            //removes survey from sondaggiShow and push it into sondaggiRisposti
            angular.forEach($rootScope.sondaggiShow, function(value, key){
                if(value.id == $rootScope.sondaggio.id){
                    $rootScope.sondaggiRisposti.push($rootScope.sondaggio)
                    $rootScope.sondaggiShow = $filter('filter')($rootScope.sondaggiShow, function(value, index) {return value.id !== $rootScope.sondaggio.id;});
                }
            })
            $state.go('app.sondaggi');
        });

    }

    $rootScope.backToRiepilogo = function(){
        $state.go('app.riepilogo');
    }
    
    $rootScope.addRisposta = function(domanda, risposta, item, radio){
        if(!radio){
            if(item.winner){
                if($rootScope.datiRisposte[domanda.id] == undefined){
                        $rootScope.datiRisposte[domanda.id] = [];
                    }
                $rootScope.datiRisposte[domanda.id].push(risposta);
            }else{
                if($rootScope.datiRisposte[domanda.id] !== undefined){
                    
                    angular.forEach($rootScope.datiRisposte[domanda.id], function(value, key){
                        if(value == risposta){
                            $rootScope.datiRisposte[domanda.id] = $filter('filter')($rootScope.datiRisposte[domanda.id], function(value, index) {return value !== risposta;});
                        }
                    })
                }
            }
        }else{
            $rootScope.datiRisposte[domanda.id] = [];
            $rootScope.datiRisposte[domanda.id].push(risposta);
        }
        console.log($rootScope.datiRisposte)
    }
    
    /*$rootScope.checked = [];
    $rootScope.checkChanged = function(item, domanda, risposta){
        console.log($rootScope.checked)
        
        if($rootScope.checked[domanda.id] == undefined){
            $rootScope.checked[domanda.id] = 0;
            //$rootScope.checked = $filter('filter')($rootScope.checked, function(value, index) {return value;});
        }
        if(item.winner){
            $rootScope.checked[domanda.id]++;
            if($rootScope.datiRisposte[domanda.id] == undefined){
                $rootScope.datiRisposte[domanda.id] = []
            }
            $rootScope.datiRisposte[domanda.id].push(risposta)
        }else{
            $rootScope.checked[domanda.id]--;

            if($rootScope.datiRisposte[domanda.id] !== undefined){
                angular.forEach($rootScope.datiRisposte[domanda.id], function(value, key){

                    if(value == risposta){
                        $rootScope.datiRisposte[domanda.id] = $filter('filter')($rootScope.datiRisposte[domanda.id], function(value, index) {return value !== risposta;});
                    }
                })
            }
        }
        console.log($rootScope.checked)
    }*/

})

.controller('AccountCtrl', function($state, $scope, $rootScope, $ionicPopup, $http) {


    $scope.modifica=function($stringa){

      $scope.data = {}

        //controllo campo da modificare
        switch($stringa){
            case 'e':
                $campo= 'Email';
                break;
            case 'pw':
                $campo= 'Password';
                break;
        }
    if($campo != "Password"){
      var myPopup = $ionicPopup.show({
         template: '<input type ="text" ng-model = "data.model">',

         scope: $scope,
         title: $campo,
         buttons: [
            { text: 'Cancel'}, {
               text: '<b>Save</b>',
               type: 'button-positive',
               onTap: function(e) {
                 if (!$scope.data.model) {
                    e.preventDefault();
                 } else {
                    return $scope.data.model;
                 }
              }
           }
        ],
      });
      myPopup.then(function(res) {
        //ok ricontrolla però
         $http.post('https://progettois.herokuapp.com/api/users/' +$rootScope.account.id + '?' + $campo.toLowerCase() + '=' + res)
            .success(function(data){
                alert("OK post");
                $scope.logOut();
            })
            .error(function(data){
                alert("Errore post");
            })
        })
    }else{
      var pwPopup = $ionicPopup.show({
         template: '<input type ="password" ng-model = "data.model">',

         scope: $scope,
         title: $campo,
         buttons: [
            { text: 'Cancel'}, {
               text: '<b>Save</b>',
               type: 'button-positive',
               onTap: function(e) {
                 if (!$scope.data.model) {
                    e.preventDefault();
                 } else {
                    return $scope.data.model;
                 }
              }
           }
        ],
      });
      pwPopup.then(function(res) {

                //ok ricontrolla però
                 $http.post('https://progettois.herokuapp.com/api/users/' +$rootScope.account.id + '?password=' + res)
                    .success(function(data){
                        alert("OK post");
                        $scope.logOut();
                    })
                    .error(function(data){
                        alert("Errore post");
                    })
        })
    };
  }

})

.controller('RegisterCtrl', function($scope, $state, $http, $ionicPopup) {
    $scope.registerData = {};

    $scope.register = function(){
        $scope.registerData.role= 'user';
        console.log($scope.registerData)
        if($scope.registerData.email && $scope.registerData.password){

            //TODO gestire errore 500 (tenere e passarci sopra)
            $http.post('https://progettois.herokuapp.com/api/new_user.json', $scope.registerData)
             .success(function(data) {
                console.log(data);
                if(!(angular.isString(data[0]))){
                    var alertPopup = $ionicPopup.alert({
                      title: 'Okay',
                      template: 'Grazie per esserti registrato/a '+$scope.registerData.email
                    });
                    alertPopup.then(function(res) {
                      $scope.backToLogin();
                    });
                }else if(!(angular.isString(data[1]))){
                    var alertPopup = $ionicPopup.alert({
                      title: 'Errore',
                      template: 'Email già utilizzata!'
                    });
                }else{
                      var alertPopup = $ionicPopup.alert({
                      title: 'Errore',
                      template: 'Password troppo corta'
                    });
                }
           })
           .error(function(data){
               alert("Errore post");
           });
        }else{
              var alertPopup8 = $ionicPopup.alert({
                title: 'Errore',
                template: 'Uno o più campi vuoti'
              });
        }
    };

    $scope.backToLogin = function(){
        $state.go('login');
    };
})


.controller('LoginCtrl', function($scope, $state, $http, $rootScope, $ionicPopup) {
    $scope.loginData = {};
    $rootScope.account= {};

    $scope.doLogin = function() {
     $credenziali = {
         email: $scope.loginData.email,
         password: $scope.loginData.password
     }
      $http.post('https://progettois.herokuapp.com/api/login', $credenziali)
          .success(function(data) {
            console.log(data);
          if(!(angular.isString(data))){
                $rootScope.account = data;
                $rootScope.account.created_at = Date.parse(data.created_at);
                $state.go('app.sondaggi');
                console.log("LOGIN email: " + $scope.loginData.email + " - PW: " + $scope.loginData.password);
          }else{
              var alertPopup8 = $ionicPopup.alert({
                title: 'Errore',
                template: 'Email o password errati'
              });
          }
        })
          .error(function(data) {

        });
  }

    $scope.doRegistrazione= function(){
        $state.go('register');
    }
});
