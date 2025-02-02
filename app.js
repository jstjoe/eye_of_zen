(function() {

  return {
    events: {
      'app.activated':    'onActivated',
      'app.deactivated':  'onDeactivated',
      // 'app.created':      'onCreated',
      'app.willDestroy':  'onDestroyed',

      'iframe.roger':'onConnected'

    },
    requests: {
      agent: function(data) {
        return {
          url: this.firebase +'/agents/'+data.agent+'.json',
          type: 'PATCH',
          contentType: 'JSON',
          data: JSON.stringify({
            date: data.date,
            id: data.agent
          })
        };
      },
      ticket: function(data) {
        return {
          url: this.firebase + '/agents/'+data.agent+'/tickets/'+data.ticket+'.json',
          type: 'PUT',
          contentType: 'JSON',
          data: JSON.stringify({
            date: data.date,
            action: data.action,
            id: data.ticket
          })
        };
      },


      user: function(data) {
        return {
          url: this.firebase + '/agents/'+data.agent+'/users/'+data.user+'.json',
          type: 'PUT',
          contentType: 'JSON',
          data: JSON.stringify({
            date: data.date,
            action: data.action,
            id: data.user
          })
        };
      }
    },

    onActivated: function(e) {
      this.log('joined');
      if(e.firstLoad) {
        // this.firebase = 'https://theeyeofzen.firebaseio.com/accounts/'+ this.currentAccount().subdomain();
      }
    },
    onDeactivated: function() {
      this.log('backgrounded');
    },
    onCreated: function() {
      // not currently used
      this.log('created');
    },
    onDestroyed: function() {
      this.log('closed');
        
    },
    log: function(action) {
      this.firebase = 'https://theeyeofzen.firebaseio.com/accounts/'+ this.currentAccount().subdomain();
      var location = this.currentLocation();
      var data;
      var date = Date.now();

      // if ticket_sidebar
      if(location == 'ticket_sidebar') {
        this.hide();
        data = {
          agent: this.currentUser().id(),
          ticket: this.ticket().id(),
          date: date,
          action: action
        };
        this.ajax('ticket', data);

      }
      // if new_ticket_sidebar
      if(location == 'new_ticket_sidebar') {
        this.hide();
        data = {
          agent: this.currentUser().id(),
          ticket: 'new',
          date: date,
          action: action
        };
        this.ajax('ticket', data);
      }

      // if user_sidebar
      if(location == 'user_sidebar') {
        this.hide();
        data = {
          agent: this.currentUser().id(),
          user: this.user().id(),
          date: date,
          action: action
        };
        this.ajax('user', data);
      }

      // if nav_bar
      if(location == 'nav_bar') {
        // data = {
        //   agent: this.currentUser().id(),
        //   date: date
        // };
        // this.ajax('agent', data);

        // if Admin -> show template
        if(this.currentUser().role() == 'admin') {
          this.switchTo('iframe', {

          });
        } else {
          this.hide();
        }
      }
    },

    // messages
    onConnected: function(data) {
      services.notify("The Eye of Zen sees all. Use it wisely.");
    },


    getUsers: function(roles) {
      // fetch users with the given roles
    },

    _location: function() {
      return; // send the current location
    }
  };

}());
