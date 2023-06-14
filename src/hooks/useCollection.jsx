import { useState, useEffect, useRef } from 'react';
import { db } from '../firebase/config';
import { collection, onSnapshot, query, where, orderBy } from 'firebase/firestore';

export const useCollection = (col, _query, _orderBy) => {
    const [documents, setDocuments] = useState(null)
    const [error, setError] = useState(null)

    const q = useRef(_query).current
    const orderByArray = useRef(_orderBy).current

    useEffect(() => {
        let ref = collection(db, col)

        if (q) {
            ref = query(ref, where(...q))
        }
        if (orderByArray) {
            ref = query(ref, orderBy(...orderByArray))
        }

        const unsub = onSnapshot(ref, (snap) => {
            try {
                let results = []
                snap.docs.forEach(doc => {
                    results.push({ ...doc.data(), id: doc.id })
                })

                // update state
                setDocuments(results)
                setError(null)
            } catch (err) {
                console.log(err.message)
                setError("Could not fetch data")
            }

            // unsubscribe on unmount
            return () => unsub()

        })
    }, [col, q, orderByArray])

    return { documents, error }

}