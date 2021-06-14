import React, { useEffect, useState } from 'react'
import { FaCode } from "react-icons/fa";
import axios from "axios";
import { Icon, Col, Card, Row, Carousel } from "antd";
import Meta from 'antd/lib/card/Meta'
import ImageSlider from '../../utils/ImageSlider';
import Checkbox from './Sections/CheckBox';
import {continents, price} from './Sections/Datas';
import Radiobox from './Sections/RadioBox';

function LandingPage() {

    const [Products, setProducts] = useState([])
    const [Skip, setSkip] = useState(0)
    const [Limit, setLimit] = useState(8)
    const [PostSize, setPostSize] = useState(0)
    const [Filters, setFilters] = useState({
        continents : [],
        price : []
    })

    useEffect(() => {

        let body = {
            skip: Skip,
            limit: Limit
        }

        getProducts(body)

    }, [])

    const getProducts = (body) => {
        axios.post('api/product/products', body)
            .then(response => {
                if (response.data.success) {
                    //console.log(response.data)
                    if (body.loadMore) {
                        setProducts([...Products, ...response.data.productInfo])
                    } else {
                        setProducts(response.data.productInfo)
                    }
                    setPostSize(response.data.postSize)

                } else {
                    alert("상품들을 가져오는데 실패했습니다.")
                }
            })
    }

    const loadMoreHanlder = () => {

        let skip = Skip + Limit

        let body = {
            skip: skip,
            limit: Limit,
            loadMore: true
        }

        getProducts(body)
        setSkip(skip)

    }

    const renderCards = Products.map((product, index) => {

        //console.log('product', product)
        return <Col lg={6} md={8} xs={24} key={index}>
            <Card
                //<img style={{ width:'100%', maxHeight:'150px'}} src={`http://localhost:5000/${product.images[0]}`} /></Col>
                cover={<ImageSlider images={product.images} />}
            >
                <Meta
                    title={product.title}
                    description={`$${product.price}`}
                />
            </Card>
        </Col>
    })

    const showFilterdResults = (filters) =>{

        let body = {
            skip: 0,
            limit: Limit,
            filters : filters
        }

        getProducts(body)
        setSkip(0)

    }

    const handlePrice= (value) =>{

        const data = price;
        let array = [];

        for (let key in data){
            if(data[key]._id === parseInt(value, 10)){
                array = data[key].array
            }
        }

        return array;
    }

    const handleFilters = (filters, category) => {

        const newFilters ={...Filters}

        newFilters[category] = filters

        console.log('filters', filters)

        if(category ==='price'){
            let priceValues = handlePrice(filters)
            newFilters[category] = priceValues
        }

        showFilterdResults(newFilters)
        setFilters(newFilters)
    }


    return (
        <div style={{ width: "75%", margin: '3rem auto' }}>
            <div style={{ textAlign: 'center' }}>
                <h2>Let's Travel Anywhere <Icon type="rocket" /> </h2>
            </div>

            {/* Filter */}
        <Row gutter = {[16,16]}>
            <Col lg={12} xs={24}>
            
            {/*CheckBox*/}
            <Checkbox list={continents} handleFilters={filters => handleFilters(filters,"continents")}/>
            </Col >

            <Col lg={12} xs={24}>
            {/*RadioBox*/}
            <Radiobox list={price} handleFilters={filters => handleFilters(filters,"price")}>

            </Radiobox>

            </Col>
        </Row>
            


            {/* Search */}

            {/* Cards */}


            <Row gutter={[16, 16]}>
                {renderCards}
            </Row>

            <br />

            {PostSize >= Limit &&
                < div style={{ display: 'flex', justifyContent: 'center' }}>
                    <button onClick={loadMoreHanlder}>더보기</button>
                </div>
            }
        </div >
    )
}

export default LandingPage
