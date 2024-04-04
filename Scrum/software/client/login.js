Template.body.events({
    'submit #login-form'(event) {
      event.preventDefault();
  
      const target = event.target;
      const username = target.username.value;
      const password = target.password.value;
  
      Meteor.loginWithPassword(username, password, function(error) {
        if (error) {
          alert(error.reason);
        } else {
        
        }
      });
    },
  
    'click #register-button'(event) {
  
      Router.go('/register');
    }
  });
  