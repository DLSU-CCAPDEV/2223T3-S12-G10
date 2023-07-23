
const avatars = document.querySelectorAll('.avatar-selection');
let lastClickedAvatar = null;

avatars.forEach(avatar => {
  avatar.addEventListener('click', function handleClick(event) {

    if (lastClickedAvatar) {
      lastClickedAvatar.style.borderColor = ''; 
    }

    avatar.style.borderColor = 'var(--color-accent)'; 
    lastClickedAvatar = avatar; 
  });
});


 function validateForm() {
      var password = document.getElementById("password").value;
      var confirm_password = document.getElementById("confirm_password").value;
      var password_error = document.getElementById("password_error");
      var avatar_error = document.getElementById("avatar_error");

      if (password !== confirm_password) {
        password_error.innerHTML = "Passwords do not match.";
        return false;
      } 
      else {
        
        password_error.innerHTML = "";
        if (!lastClickedAvatar) {
          avatar_error.innerHTML = "Pick an avatar";
          return false;
      }
          return true;
        
      }

     
}

