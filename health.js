import { collection, addDoc, getDocs, updateDoc, doc } from "firebase/firestore";
import { db, auth } from "./firebase.js";

const postForm = document.getElementById('post-form');
const postsList = document.getElementById('posts-list');

// 게시물 가져오기
async function fetchPosts() {
    const querySnapshot = await getDocs(collection(db, 'health_posts'));
    postsList.innerHTML = '';
    querySnapshot.forEach((doc) => {
        const post = doc.data();
        const postElement = document.createElement('li');
        postElement.textContent = `${post.content} (Likes: ${post.likes})`;
        const likeButton = document.createElement('button');
        likeButton.textContent = 'Like';
        likeButton.addEventListener('click', () => likePost(doc.id, post.likes));
        postElement.appendChild(likeButton);
        postsList.appendChild(postElement);
    });
}

// 게시물 작성
postForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const content = document.getElementById('post-content').value;
    const user = auth.currentUser;
    if (user) {
        await addDoc(collection(db, 'health_posts'), {
            uid: user.uid,
            content: content,
            likes: 0,
            createdAt: new Date()
        });
        postForm.reset();
        fetchPosts();
    } else {
        alert('You need to be logged in to post.');
    }
});

// 게시물 추천
async function likePost(postId, currentLikes) {
    const postRef = doc(db, 'health_posts', postId);
    await updateDoc(postRef, {
        likes: currentLikes + 1
    });
    fetchPosts();
}

// 초기 게시물 로드
fetchPosts();
