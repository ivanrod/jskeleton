'use strict';
/*globals require,define,describe,it, Jskeleton, before */
/* jshint unused: false */
describe('In view-controller ', function() {
    var sandbox = sinon.sandbox.create();

    before(function() {

        this.stubNewFactory = sandbox.stub(Jskeleton.factory, 'new');

        this.ViewController = Jskeleton.ViewController;

        this.createViewController = function(options) {
            return new this.ViewController(options);
        };

        this.mainRegion = new Backbone.Marionette.Region({
            el: 'body'
        });

        this.viewControllerOptions = {
            app: 'app',
            channel: 'channel',
            region: 'region'
        };
    });

    it('it exists and extends an object', function() {
        expect(this.ViewController).to.be.a('function');
        expect(this.ViewController.prototype).to.be.an('object');
    });

    it('it has all namespace properties', function() {
        expect(this.ViewController.prototype).to.include.keys(
            'constructor',
            '_ensureOptions',
            'mixinTemplateHelpers',
            'addComponent',
            'destroy',
            '_destroyComponents',
            '_delegateComponentEvent',
            '_undelegateComponentEvent',
            'unbindComponents',
            'bindComponents',
            'render'
        );
    });

    it('we can create a new view-controller object', function() {
        expect(this.createViewController.bind(this, this.viewControllerOptions)).to.not.throw(Error);
        expect(this.createViewController(this.viewControllerOptions)).to.be.instanceof(this.ViewController);
    });

    it('throws errors if we try to create a new view-controller with any option missing', function() {
        expect(this.createViewController).to.throw(Error);

        expect(this.createViewController.bind(this, {
            app: 'app',
            channel: 'channel'
        })).to.throw(Error);

        expect(this.createViewController.bind(this, {
            app: 'app',
            region: 'region'
        })).to.throw(Error);

        expect(this.createViewController.bind(this, {
            region: 'region',
            channel: 'channel'
        })).to.throw(Error);

    });

    describe('When we have a view-controller object', function() {

        beforeEach(function() {

            this.ViewComponent = Jskeleton.ItemView.extend({
                template: '<strong id="view-action"> Test Title </strong>',
                events: {
                    'click #view-action': 'onActionClicked',
                },
                onActionClicked: function(event) {
                    this.trigger('buy', event);
                }
            });

            this.OtherViewComponent = Jskeleton.ItemView.extend({
                template: '<strong id="other-view-action"> Other Test Title </strong>',
                events: {
                    'keypress #other-view-action': 'onActionKeypress',
                },
                onActionKeypress: function(event) {
                    this.trigger('sell', event);
                }
            });

            this.ViewController = Jskeleton.ViewController.extend({
                events: {
                    'buy @component.viewComponent': 'onLink',
                    'sell @component.otherViewComponent': 'onLink'
                },
                template: 'viewComponent: {{@component name="viewComponent"}}' +
                    'otherViewComponent: {{@component name="otherViewComponent"}}',
                onLink: function(event) {},
            });

            this.viewComponentSpyEvent = sinon.spy(this.ViewComponent.prototype,
                'onActionClicked');

            this.viewComponent = new this.ViewComponent();

            this.stubNewFactory.withArgs('viewComponent').returns(this.viewComponent);

            this.otherViewComponentSpyEvent = sinon.spy(this.OtherViewComponent.prototype,
                'onActionKeypress');

            this.otherViewComponent = new this.OtherViewComponent();

            this.stubNewFactory.withArgs('otherViewComponent').returns(this.otherViewComponent);

            this.viewController = this.createViewController(this.viewControllerOptions);

            this.viewControllerSpyEvent = sinon.spy(this.viewController, 'onLink');

        });

        it('we can add components', function() {
            expect(this.viewController.components).to.be.an('object');

            this.viewController.addComponent('ViewComponent', this.viewComponent);
            expect(Object.keys(this.viewController.components)).to.have.length.above(0);

            this.viewController.addComponent('OtherViewComponent', this.otherViewComponent);
            expect(Object.keys(this.viewController.components)).to.have.length.above(1);
        });

        describe(', rendering it in a region', function() {

            beforeEach(function() {
                this.mainRegion.show(this.viewController);
            });

            it('it is rendered', function() {
                expect(this.viewController.isRendered).to.be.true;
            });

            it('all its components are rendered', function() {
                expect(this.viewComponent.isRendered).to.be.true;
                expect(this.otherViewComponent.isRendered).to.be.true;
            });

            it('has all component events attached to it', function() {
                var self = this;
                self.componentListeners = [];

                _.each(this.viewController._listeningTo, function(listener) {
                    self.componentListeners.push(listener._listenId);
                });

                _.each(this.viewController.components, function(classComponents) {
                    _.each(classComponents, function(component) {
                        expect(_.contains(self.componentListeners, component._listenId))
                            .to.be.true;
                    });
                });
            });

            it('events run properly', function() {
                $('#view-action').click();
                $('#other-view-action').keypress();

                expect(this.viewComponentSpyEvent.calledOnce).to.be.equal(true);
                expect(this.otherViewComponentSpyEvent.calledOnce).to.be.equal(true);
                expect(this.viewControllerSpyEvent.calledTwice).to.be.equal(true);
            });

            describe(', if destroy the instance', function(){
                beforeEach(function(){
                    this.viewController.destroy();
                });

                it('the controller should be destroyed', function(){
                    expect(this.viewController.isDestroyed).to.be.true;
                });

                it('all its components should be unbinded', function(){
                    _.each(this.viewController.components, function(componentArray) {
                        _.each(componentArray, function(component) {
                            expect(component).to.be.undefined;
                        });
                    });
                });
            });

            describe(', if we refresh view-controller', function() {

                beforeEach(function() {
                    this.AnotherViewComponent = Jskeleton.ItemView.extend({
                        template: '<strong id="another-view-action"> another Test Title </strong>',
                    });

                    this.anotherViewComponent = new this.AnotherViewComponent();

                    this.stubNewFactory.withArgs('anotherViewComponent').returns(this.anotherViewComponent);

                    this.viewController.template = 'refresh viewComponent: {{@component name="viewComponent"}}, ' +
                        'anotherViewComponent: {{@component name="anotherViewComponent"}}';

                    this.viewComponent = new this.ViewComponent();

                    this.stubNewFactory.withArgs('viewComponent').returns(this.viewComponent);

                    this.viewController.render();
                });

                it('components are resetted', function() {
                    var self = this;

                    expect(this.otherViewComponent.isDestroyed).to.be.true;

                    self.renderedViewsCounter = 0;

                    _.each(this.viewController.components, function(classComponents) {
                        _.each(classComponents, function(component) {
                            if (component && component.isRendered) {
                                self.renderedViewsCounter += 1;
                            }
                        });
                    });

                    expect(this.renderedViewsCounter).to.be.equal(2);
                });

                it('events are delegated properly', function() {
                    $('#view-action').click();
                    expect(this.viewComponentSpyEvent.calledOnce).to.be.true;
                    expect(this.viewControllerSpyEvent.calledOnce).to.be.true;

                    $('#other-view-action').keypress();
                    expect(this.viewControllerSpyEvent.calledOnce).to.be.true;
                    expect(this.otherViewComponentSpyEvent.calledOnce).to.be.false;
                });
            });
        });
    });
});
