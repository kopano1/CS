import React, { useState, useEffect} from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Row, Col, Image, ListGroup, Button, Card, Form, ListGroupItem } from 'react-bootstrap'
import Rating from '../components/Rating'
import Loader from '../components/Loader'
import Message from '../components/Message'
import { listProductDetails } from '../actions/productActions'
import { Link, useParams } from 'react-router-dom'
import { useNavigate } from 'react-router-dom';


 function ProductScreen() {
  const [qty, setQty] = useState(1);
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const { id } = useParams();

  const productDetails = useSelector(state => state.productDetails);
  const { product, loading, error } = productDetails;

  useEffect(() => {
    dispatch(listProductDetails(id));
  }, [dispatch, id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  
  const addToCartHandler = () =>{
    navigate(`/cart/${id}?qty=${qty}`);
  }


  return (
    <div>
      <Link to='/' className='btn btn-light my-3'>Go Back</Link>
      {loading ? 
        <Loader />
        : error
          ? <Message variant='danger'>{error}</Message>
        :(
          <Row>
        <Col md={6}>
          <Image src={product.image} alt={product.name} fluid />
        </Col>

        <Col md={3}>
          <ListGroup variant='flush'>
            <ListGroup.Item>
              <h3>{product.name}</h3>
            </ListGroup.Item>

            <ListGroup.Item>
              <Rating value={product.rating} text={`${product.numReviews} reviews`} color={'#f8e825'} />
            </ListGroup.Item>

            <ListGroup.Item>
              Price: ${product.price}
            </ListGroup.Item>

            <ListGroup.Item>
              Description: {product.description}
            </ListGroup.Item>
          </ListGroup>
        </Col>

        <Col md={3}>
          <Card>
            <ListGroup variant='flush'>
              <ListGroupItem>
                <Row>
                  <Col>Price:</Col>
                  <Col>
                    <strong>${product.price}</strong>
                  </Col>
                </Row>
              </ListGroupItem>

              <ListGroupItem>
                <Row>
                  <Col>Status:</Col>
                  <Col>
                    {product.countInStock > 0 ? 'In Stock' : 'Out of Stock'}
                  </Col>
                </Row>
              </ListGroupItem>

              {product.countInStock > 0 &&(
                <ListGroup.Item>
                  <Row>
                    <Col>Qty</Col>
                    <Col xs='auto' className='my-1'>
                      <Form.Control
                        as="select"
                        value={qty}
                        onChange={(e) => setQty(e.target.value)}
                      >
                        {
                          [...Array(product.countInStock).keys()].map((x) =>(
                            <option key={x + 1} value={x + 1}>
                              {x + 1}
                            </option>
                          ))
                        }

                      </Form.Control>
                    </Col>
                  </Row>
                </ListGroup.Item>
              )}

              <ListGroupItem>
                <Button 
                onClick={addToCartHandler}
                className='btn-block' 
                disabled={product.countInStock === 0} 
                type='button'>Add to Cart</Button>
              </ListGroupItem>
            </ListGroup>
          </Card>
        </Col>
      </Row>
        )
    
      }

      
    </div>
  )
}

export default ProductScreen;
