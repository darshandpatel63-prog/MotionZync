// src/components/Loading/Loading.jsx
import './Loading.css'

export default function CenteredLoader({ message = 'Loading...' }) {
  return (
    <div className="cl-wrap">
      <div className="cl-inner">
        <div className="cl-ring">
          <div/><div/><div/><div/>
        </div>
        <span className="cl-msg">{message}</span>
      </div>
    </div>
  )
}

