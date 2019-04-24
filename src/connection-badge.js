import React from 'react'
import classnames from 'classnames'

const ConnectionBadge = props => {
  const { isOnline } = props

  const className = classnames(
    'badge',
    'my-3',
    {
      'badge-success': isOnline,
      'badge-danger': !isOnline
    }
  )

  return (
    <div className={className}>
      {isOnline ? 'ONLINE' : 'OFFLINE'}
    </div>
  )
}

export default ConnectionBadge
