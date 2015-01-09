var app = app || {};

app.LibraryView = Backbone.View.extend({

    initialize: function(options) {
        this.collection.on('add reset remove', function() {
            this.render(this.collection);
        }, this);

        this.itemView = options.itemView;
        this.filter = options.filter || false;
        if (this.filter) {
            this.search(this.filter)
        } else {
            this.render();
        }
    },

    render: function(collection, isFiltered) {
        var numActiveItems = 0,
            totalItems = 0,
            numItemsDisplayed = 0;
            this.el_html = '';

        collection = collection || this.collection;
        if (isFiltered && collection.length == this.collection.length) {
            return this;
        }
        this.$el.html('');

        if (!isFiltered) {
            if (collection.length > 0) {
                collection.each(function(item) {
                    this.renderItem(item);
                }, this);
                this.$el.append(this.el_html);
            } else {
                this.$el.html($('#noItemsTemplate').html());
            }
        } else {
            //get the total number of active items
            numActiveItems = this.collection.where({
                active: true
            }).length;
            totalItems = numActiveItems;
            numItemsDisplayed = collection.toArray().length;
            if (numItemsDisplayed < totalItems) {
                this.$el.html('Displaying ' + numItemsDisplayed + ' out of ' + totalItems);
            }
            collection.each(function(item) {
                this.renderItem(item);
            }, this);
            this.$el.append(this.el_html);
        }

        return this;
    },

    renderItem: function(item) {
        var itemView = new this.itemView({
            model: item
        });
        this.el_html += itemView.render().el.outerHTML;
    },

    search: function(options) {
        var collection = (options && options.collection ? options.collection : this.collection);

        if (!options || options.val == '') {
            this.render(this.collection, false);
        } else {
            this.render(collection.search(options), true);
        }
    }
});
