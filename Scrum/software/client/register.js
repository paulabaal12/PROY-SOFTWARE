Template.body.events({
    'submit #register-form'(event) {
      event.preventDefault();
  
      const target = event.target;
      const name = target.name.value;
      const password = target.password.value;
      const dpi = target.dpi.value;
      const location = target.location.value;
      const profilePicture = target.profilePicture.files[0];
  
      Accounts.createUser({
        username: name,
        password: password,
        profile: {
          dpi: dpi,
          location: location,
          profilePicture: profilePicture
        }
      }, function(error) {
        if (error) {
          alert(error.reason);
        } else {
        
        }
      });
    }
  });
  