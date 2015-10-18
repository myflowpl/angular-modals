# angular-modals
Simple manager for angular-ui-bootstrap modals.  
Create and register your modals and later easily open them with $modals service or modal dreictive

## Idea
The main idea behind the manager is to treat the modals as async services.  
So lets compare it to $http service

if you want to get user profile form server, probably you are going to use $http
```javascript
$http.get('/user/prifle', {profile_id: 1}).then(function(profile){
    // handle success
}, function(error){
    // handle error
});
```
Why not treat the modals the same way.  
Lets say you want to edit the profile inside the modal.  
The operation should be as simple as:
```javascript
$modals.open('user-edit', {profile_id: 1}).then(function(profile){
    // handle success
}, function(error){
    // handle error
});
```
## Instalation

you have to install: angular, angular-ui-bootstrap and angular-modals of course

## Use your modals
After you register your modals you can use: 
### service
```javascript
$modals.open('user-edit', {profile_id: 1}).then(function(profile){
    // handle success
}, function(error){
    // handle error
});
```
### directive
just show simple modal, it will simply open and show some info, no params, no configs, no callbacks 
```html
<button modal="how-to-edit-user">need help?</button>
```
more advanced example, open 'user-edit' modal and pass some params to it, then listen for the close or dismiss events
```html
<button
    modal="user-edit"
    modal-config="{size:'xl'}"
    modal-params="{profile_id: user.profile_id}"
    modal-on-success="onUserEditSuccess($data)"
    modal-on-error="onUserEditCancel($data)"
>Edit</button>
```

## Create and register your modals

Best practice is to separate your modal to 3 files, script, template, styles and put them in the same directory

/user-edit-modal.js  
modal configuration and controller code
```javascript
angular.module('app', ['angularModals'])

    .config(function($modalsProvider){
        $modalsProvider.register('user-edit', function(params, config){
            return {
                templateUrl: 'user-edit-modal.html',
                controller: 'UserEditModal',
                windowClass: 'user-edit-modal',
                size: 'lg',
                resolve: {
                    // you can add some extra resolves here
                }
            };
        });
    })

    .controller('UserEditModal', function ($scope, $modalInstance, params, $http) {
    
        $scope.params = params; // params will be always available 
        
        var profileId = params.profile_id; // this are the parameters you pass when you open the modal

        // you probably want to load the profile here and allow the user to edit it and save
        $http.get('/user/profile', {profile_id: profileId}).then(function(profile){
            $scope.profile = profile
        }, function(response){
           // handle the profile loading error 
        })

        // save method
        $scope.ok = function () {
            $http.post('/user/profile-save', $scope.profile).then(function(profile){
            
                // profile was successfully edited, close the modal and resolve the modal promise with new profile object
                $modalInstance.close(profile);
                
            }, function(response){
               // handle the profile save error 
            })
            
        };

        $scope.cancel = function () {
            $modalInstance.dismiss({message: 'close'});
        };

    });
```
/user-edit-modal.html          
template html
```html
<div class="user-edit-modal-body">
    <div class="modal-header">
        <button type="button" class="close" ng-click="cancel()" aria-hidden="true">&times;    </button>
        <h3 class="modal-title">Edit user profile</h3>
    </div>
    <div class="modal-body">

        <p>... put hour user edit form here.... </p>

    </div>
    <div class="modal-footer">
        <button class="btn btn-primary" ng-click="ok()">OK</button>
        <button class="btn btn-warning" ng-click="cancel()">Cancel</button>
    </div>
</div>
```
/user-edti-modal.scss
styles (sass example)
```sass
.user-edit-modal {
    // styles of all modal
    .user-edit-modal-body {
        // styles for the body
    }
}
```
