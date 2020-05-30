import React, { Component } from 'react';
import PropTypes from 'prop-types';
import DeletButton from './DeleteItem';
import Title from './styles/Title';
import ItemStyles from './styles/ItemStyles';
import PriceTag from './styles/PriceTag';
import Link from 'next/link';
import formatMoney from '../lib/formatMoney';

class Item extends Component {
    render() {
        const {item} = this.props;
        return <ItemStyles>
            {item.image && <img src={item.image} alt={item.title}></img>}
            {/* {item.image?<img/>:null} */}
            <Title>
                {/* First { } tells u want to pass references using js
                and the second {} tells us object literal*/}
                <Link href={
                    {
                        pathname:'/item',
                        query:{
                            id:item.id
                        }
                    }
                }>
                    <a>{item.title}</a>
                </Link>
            </Title>
            <PriceTag>{formatMoney(item.price)}</PriceTag>
            <p>{item.description}</p>

            <div class="buttonList">
                <Link
                href={{
                    pathname:'update',
                    query:{id:item.id}
                }}
                ><a>EDIT</a></Link>
                <button>Add to Cart</button>
                <DeletButton id={item.id}>Delete</DeletButton>

            </div>
        </ItemStyles>
        ;
    }
}

Item.propTypes = {
    item:PropTypes.object.isRequired,


};

export default Item;