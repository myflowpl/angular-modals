/**
 * Modal helper module
 */


angular.module('angularModals', ["ui.bootstrap.modal"])

    /**
     * @ngdoc directive
     * @name modal
     * @restrict A
     * @description
     *
     * shows modal from the $modals registry
     *
     * ```html
     <button
         modal="confirm"
         modal-config="{size:'xs'}"
         modal-params="app.dataPassedToModalInstance"
         modal-on-success="closeIt($data)"
         modal-on-error="dismissIt($data)"
     >open 'confirm' modal and pass some params to it, then listen for the close or dismiss events</button>

     <button modal="{name:'confirm', size: 'xs'}" modal-params="app.user">instead of the string, pass object witch overwrites modal instance config</button>

     <button modal="confirm"> just show modal </button>
     ```

     * @param {string} modal modal name to open, have to be registered like this: $modals.register('nazwa', function(){});
     * @param {expresion=} modalConfig configuration object for the modal
     * @param {expresion=} modalParams params you want to pass to the modal
     * @param {expresion=} modalOnSuccess success callback, $data will be available as the result of the modal promise
     * @param {expresion=} modalOnError error callback (dismis or close), $data will be available as the result of the modal promise
     */
    .directive('modal', ['$modals', '$parse', function ($modals, $parse) {
        return {
            restrict: 'A',
            link: function (scope, element, attr) {
                var onClose = $parse(attr.modalOnSuccess);
                var onDismiss = $parse(attr.modalOnError);
                var getConfig = $parse(attr.modalConfig);
                var getParams = $parse(attr.modalParams);

                element.on('click', function () {
                    $modals.open(attr.modal, getParams(scope) || {}, getConfig(scope) || {}).then(function (data) {
                        onClose(scope, {$data: data});
                    }, function (reason) {
                        onDismiss(scope, {$data: reason});
                    });
                });

            }
        };
    }])

    /**
     * $modals service provider
     */
    .provider('$modals', function () {
        var modals = {};
        var defaults = {};
        this.register = function (name, config) {
            modals[name] = config;
        };
        this.$get = ["$uibModal", function ($uibModal) {

            return {
                /**
                 * open modal and returns promise
                 *
                 * @param name
                 * @param params
                 * @param config
                 * @returns {Promise}
                 */
                open: function (name, params, config) {
                    return this.show(name, params, config).result;
                },

                /**
                 * open modal and return it's instance
                 *
                 * @param name
                 * @param params
                 * @param config
                 * @returns {ModalInstance}
                 */
                show: function (name, params, config) {

                    config = angular.merge({}, defaults, modals[name](params, config) || {}, config || {});
                    if (!config.resolve) {
                        config.resolve = {};
                    }
                    config.resolve.params = function () {
                        return params || {};
                    };
                    return $uibModal.open(config);
                }
            };
        }];
    });

