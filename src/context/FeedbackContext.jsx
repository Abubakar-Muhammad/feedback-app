import { createContext, useState, useEffect } from 'react'

const FeedbackContext = createContext()
const URL = 'http://localhost:4000/feedback'

export const FeedbackProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true)
  const [feedback, setFeedback] = useState([])
  const [feedbackEdit, setFeedbackEdit] = useState({
    item: {},
    edit: false,
  })

  useEffect(() => {
    fetchFeedback()
  }, [])

  // Fetch feedback
  const fetchFeedback = async () => {
    const response = await fetch(`${URL}?_sort=id&_order=desc`)
    const data = await response.json()
    setFeedback(data)
    setIsLoading(false)
  }

  //Delete Feedback
  const deleteFeedback = async (id) => {
    if (window.confirm('Are you sure you want to delete?')) {
      await fetch(`${URL}/${id}`, {
        method: 'DELETE',
      })

      setFeedback((prev) => {
        return prev.filter((item) => item.id !== id)
      })
    }
  }

  const updateFeedback = async (id, feedbackItem) => {
    const response = await fetch(`${URL}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(feedbackItem),
    })

    const data = await response.json()

    setFeedback((prev) => {
      return prev.map((item) => {
        return item.id === id ? data : item
        // item.id === id ? {...item, ...feedbackItem} : item
      })
    })
  }

  // Add Feedback
  const addFeedback = async (newFeedback) => {
    const response = await fetch(URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newFeedback),
    })
    const data = await response.json()
    setFeedback([data, ...feedback])
    // setFeedback([{ ...newFeedback, id: uuid() }, ...feedback])
  }

  //   Set item to be updated
  const editFeedback = (item) => {
    setFeedbackEdit({
      item,
      edit: true,
    })
  }

  return (
    <FeedbackContext.Provider
      value={{
        addFeedback,
        deleteFeedback,
        editFeedback,
        feedback,
        feedbackEdit,
        isLoading,
        updateFeedback,
      }}
    >
      {children}
    </FeedbackContext.Provider>
  )
}

export default FeedbackContext
