const Main = imports.ui.main;
const MainLoop = imports.mainloop;
const Lang = imports.lang;
const PanelMenu = imports.ui.panelMenu;
const St = imports.gi.St;
const Clutter = imports.gi.Clutter;

function PlanetsExtension(extensionMeta) {
    this._init(extensionMeta);
}

PlanetsExtension.prototype = {
    __proto__: PanelMenu.Button.prototype,

    _init: function(extensionMeta) {
        PanelMenu.Button.prototype._init.call(this, 0.0);

        this.extensionMeta = extensionMeta;

        this._settings = Convenience.getSettings();

        this.panelContainer = new St.BoxLayout({style_class: "panel-box"});
        this.actor.add_actor(this.panelContainer);
        this.actor.add_style_class_name('panel-status-button');

        this.panelLabel = new St.Label({
            text: 'Planets init…',
            y_align: Clutter.ActorAlign.CENTER
        });
        this.panelContainer.add(this.panelLabel);

        this.last_update = 0;

        MainLoop.timeout_add(this._settings.get_int("refresh-interval"),
                            Lang.bind(this, function() {
            this.last_update++;

            this.panelLabel.set_text("Update count: " + this.last_update);
        }));
    }
};

function ExtensionController(extensionMeta) {
    return {
        extensionMeta: extensionMeta,
        extension: null,

        enable: function() {
            this.extension = new PlanetsExtension(this.extensionMeta);

            Main.panel.addToStatusArea("planets", this.extension, 0, "right");
        },

        disable: function() {
            this.extension.actor.destroy();
            this.extension.destroy();

            this.extension = null;
        }
    };
}

function init(extensionMeta) {
    // Do whatever it takes to initialize your extension, like
    // initializing the translations. However, never do any widget
    // magic here.

    // Then return the controller object
    return new ExtensionController(extensionMeta);
}
