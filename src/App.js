import React from 'react'
import message from 'antd/lib/message'
import Button from 'antd/lib/button'
import { echo } from '@/utils'
export default () => {
  return (
    <div>
      <Button onClick={() => message.info('clicked button')}>Button</Button>
      <Button onClick={() => echo('clicked button')}>echo Button</Button>
    </div>
  )
}