// React imports
import { useState, useEffect } from "react";

// Firebase
import { auth, db } from "../firebase/config";
import { useAuthContext } from "./useAuthContext";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, updateDoc } from 'firebase/firestore'

export const useLogin = () => {
    const [isCancelled, setIsCancelled] = useState(false)
    const [error, setError] = useState(null)
    const [isPending, setIsPending] = useState(false)
    const { dispatch } = useAuthContext()

    const login = async (email, password) => {
        setError(null)
        setIsPending(true)

        // sign user in
        try {
            const res = await signInWithEmailAndPassword(auth, email, password)

            // dispatch login action
            dispatch({ type: "LOGIN", payload: res.user })

            // update user document
            await updateDoc(doc(db, 'users', res.user.uid), { online: true })
            
            // update state
            if (!isCancelled) {
                setIsPending(false)
                setError(null)
            }
        } catch (err) {
            if (!isCancelled) {
                // update state
                setError(err.message)
                setIsPending(false)
            }
        }
    }

    useEffect(() => {
        return () => setIsCancelled(true)
      }, [])

    return { login, error, isPending }
}