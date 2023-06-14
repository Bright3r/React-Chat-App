import { useReducer, useEffect, useState } from 'react'
import { db } from '../firebase/config'
import { addDoc, Timestamp, collection, deleteDoc, doc, updateDoc } from 'firebase/firestore'

let initialState = {
    document: null,
    isPending: false,
    error: null,
    success: null
}

const firestoreReducer = (state, action) => {
    switch (action.type) {
        case 'IS_PENDING':
            return { isPending: true, document: null, success: false, error: null }
        case 'ADDED_DOC':
            return { isPending: false, document: action.payload, success: true, error: null }
        case 'DELETED_DOC':
            return { isPending: false, document: action.payload, success: true, error: null }
        case 'UPDATED_DOC':
            return { isPending: false, document: action.payload, success: true, error: null }
        case 'ERROR':
            return { isPending: false, document: null, success: false, error: action.payload }
        default:
            return state
    }
}

export const useFirestore = (col) => {
    const [response, dispatch] = useReducer(firestoreReducer, initialState)
    const [isCancelled, setIsCancelled] = useState(false)

    // only dispatch if not cancelled
    const dispatchIfNotCancelled = (action) => {
        if (!isCancelled) {
            dispatch(action)
        }
    }

    // collection ref
    const ref = collection(db, col)

    // add a document
    const addDocument = async (doc) => {
        dispatch({ type: "IS_PENDING" })

        try {
            const createdAt = Timestamp.fromDate(new Date())
            const addedDoc = await addDoc(ref, { ...doc, createdAt })
            dispatchIfNotCancelled({ type: 'ADDED_DOC', payload: addedDoc })
        } catch (err) {
            dispatchIfNotCancelled({ type: 'ERROR', payload: err.message })
        }
    }

    // delete a document
    const deleteDocument = async (id) => {
        dispatch({ type: 'IS_PENDING' })

        try {
            const deletedDoc = await deleteDoc(doc(ref, id))
            dispatchIfNotCancelled({ type: 'DELETED_DOC', payload: deletedDoc })
        } catch (err) {
            dispatchIfNotCancelled({ type: 'ERROR', payload: "Could not delete" })
        }
    }

    // update documents
    const updateDocument = async (id, updates) => {
        dispatch({ type: 'IS_PENDING' })

        try {
            const updatedDocument = await updateDoc(doc(ref, id), updates)
            dispatchIfNotCancelled({ type: 'UPDATED_DOC', payload: updateDocument })
            return updatedDocument
        } catch (err) {
            dispatchIfNotCancelled({ type: 'ERROR', payload: err.message })
            return null
        }
    }

    useEffect(() => {
        return () => setIsCancelled(true)
    }, [])

    return { addDocument, deleteDocument, updateDocument, response }

}