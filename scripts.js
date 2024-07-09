import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "./firebase.js";
import { collection, addDoc } from "firebase/firestore";
import { db } from "./firebase.js";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { collection, addDoc } from "firebase/firestore";
import { storage, db, auth } from "./firebase.js";

document.addEventListener('DOMContentLoaded', () => {
    console.log('HappyTree is ready!');
});

document.getElementById('signup-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;
  
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        console.log('User signed up:', userCredential.user);
      })
      .catch((error) => {
        console.error('Error signing up:', error);
      });
  });
  
  document.getElementById('login-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
  
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        console.log('User logged in:', userCredential.user);
      })
      .catch((error) => {
        console.error('Error logging in:', error);
      });
  });

  // 회원가입 시 사용자 데이터 저장
createUserWithEmailAndPassword(auth, email, password)
.then((userCredential) => {
  console.log('User signed up:', userCredential.user);
  return addDoc(collection(db, 'users'), {
    uid: userCredential.user.uid,
    email: email
  });
})
.then(() => {
  console.log('User data saved to Firestore');
})
.catch((error) => {
  console.error('Error signing up:', error);
});

document.getElementById('upload-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const file = document.getElementById('file-upload').files[0];
    const user = auth.currentUser;
  
    if (user && file) {
      const storageRef = ref(storage, `uploads/${user.uid}/${file.name}`);
      uploadBytes(storageRef, file).then((snapshot) => {
        return getDownloadURL(snapshot.ref);
      }).then((downloadURL) => {
        return addDoc(collection(db, 'memories'), {
          uid: user.uid,
          url: downloadURL,
          name: file.name,
          createdAt: new Date()
        });
      }).then(() => {
        console.log('File uploaded and metadata saved');
      }).catch((error) => {
        console.error('Error uploading file:', error);
      });
    }
  });