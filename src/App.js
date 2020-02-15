import React from 'react'
import message from 'antd/lib/message'
import Button from 'antd/lib/button'
export default () => {
  return <Button onClick={() => message.info('clicked button')}>Button</Button>
}