import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { useEffect } from "react";

useEffect(() => {
  GoogleSignin.configure({
    webClientId:
      "821962837558-e476d0pq2n2nl68tui5qj8jegr5s496r.apps.googleusercontent.com",
    iosClientId:
      "821962837558-l7visi2admus17d9oda7o27vn4tmbps2.apps.googleusercontent.com",
    profileImageSize: 150,
  });
});
