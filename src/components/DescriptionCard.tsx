import React from 'react'
import { Card } from 'react-bootstrap'

const DescriptionCard: React.FC = () => {
  return (
    <Card className="mx-auto" style={{ maxWidth: '600px' }}>
      <Card.Body>
        <Card.Text>
          <b>Funey</b> is a website that makes Mo<b>ney</b> <b>Fun</b> :)
        </Card.Text>
        <Card.Text>
          To get started, create a fake &quot;bank&quot; account for your little ones, set a
          balance, and an interest rate (accrued monthly) and then add the website link to their
          mobile device or iPad for &quot;viewing&quot; their balance. As they earn or spend money,
          come back to the manage page (bookmark or login) and update their account totals.
        </Card.Text>
      </Card.Body>
    </Card>
  )
}

export default DescriptionCard
