import React from 'react'
import { Card, CardGroup } from 'react-bootstrap'
import { Link } from 'react-router-dom'

// I make destructuring
// taking out the product from props
// and call it as a variable product

const Product = ({ product }) => {
   return (
      <Card className='my-3 ' style={{ borderRadius: '3%', border: 'none' }}>
         <Link to={`/product/${product._id}`}>
            <Card.Img
               src={`http://localhost:5000/api/upload/products/${product._id}/image`}
               variant='top'
               style={{
                  borderRadius: '3%'
               }}
               // style={{
               //    borderRadius: '3%',
               //    objectFit: 'contain',
               //    width: '100%',
               //    height: '16vw'
               // }}
            />
         </Link>

         <Card.Body>
            <Link
               to={`/product/${product._id}`}
               style={{ textDecoration: 'none' }}
            >
               <Card.Title as='div'>
                  <strong>{product.name}</strong>
               </Card.Title>
            </Link>

            {/* num reviews of product */}
            {/* <Card.Text as='div'>
          <Rating
            value={product.rating}
            text={`${product.numReviews} reviews`}
          />
        </Card.Text> */}
            <Card.Text as='h3'>₪{product.price}</Card.Text>
         </Card.Body>
      </Card>
   )
}

export default Product
