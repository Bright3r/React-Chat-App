import { useEffect, useState } from "react";

// Firebase
import { db } from "../firebase/config";
import { doc, onSnapshot } from "firebase/firestore";

export const useDocument = (col, id) => {
    const [document, setDocument] = useState(null)
    const [error, setError] = useState(null)

    useEffect(() => {
        const ref = doc(db, col, id)

        const unsub = onSnapshot(ref, (snapshot) => {
            try {
                if (snapshot.data())
                {
                    setDocument({...snapshot.data(), id: snapshot.id})
                    setError(null)
                } else {
                    setError('No such document exists')
                }
            } catch (err) {
                setError('Failed to get document')
            }
        })

        return () => unsub()

    }, [col, id])

    return { document, error }

}