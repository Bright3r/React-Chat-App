// React imports
import { useState, useEffect } from 'react';

// Firebase imports
import { auth, storage, db } from '../firebase/config';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, doc, setDoc } from 'firebase/firestore';

// Hooks
import { useAuthContext } from '../hooks/useAuthContext'

const useSignup = () => {
    const [isCancelled, setIsCancelled] = useState(false)
    const [error, setError] = useState(null)
    const [isPending, setIsPending] = useState(false)
    const { dispatch } = useAuthContext()

    const signup = async (email, password, username, thumbnail) => {
        setError(null)
        setIsPending(true)

        try {
            // signup user
            const res = await createUserWithEmailAndPassword(auth, email, password, thumbnail)

            if (!res) {
                throw new Error('Could not complete signup')
            }

            // upload user thumbnail
            const uploadPath = `thumbnails/${res.user.uid}/${thumbnail.name}`
            const storageRef = ref(storage, uploadPath)
            const uploadTask = await uploadBytes(storageRef, thumbnail)
            const imgUrl = await getDownloadURL(uploadTask.ref)

            // add username and profile pic to user
            await updateProfile(res.user, { displayName: username, photoURL: imgUrl })

            // create a user document
            await setDoc(doc(db, 'users', res.user.uid), {
                online: true,
                displayName: username,
                photoURL: imgUrl
            })

            // dispatch login action
            dispatch({ type: 'LOGIN', payload: res.user })

            // update state
            if (!isCancelled) {
                setIsPending(false)
                setError(null)
            }

        } catch (err) {
            // update state
            if (!isCancelled) {
                console.error(err.message)
                setError(err.message)
                setIsPending(false)
            }
        }
    }

    useEffect(() => {
        return () => setIsCancelled(true)
    }, [])
    

    return { error, isPending, signup }
}
 
export default useSignup;