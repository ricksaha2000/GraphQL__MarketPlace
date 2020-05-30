import React, { Component } from 'react';
import {Query} from 'react-apollo';
import gql from 'graphql-tag';
import styled from "styled-components";
import Item from "./Item";
import Pagination from './Pagination';
import { perPage } from '../config';

const ALL_ITEMS_QUERY = gql`

    query ALL_ITEMS_QUERY(
        $skip:Int = 0,
        $first:Int = ${perPage}
    ){
        items(

            first:$first,
            skip:$skip,
            orderBy: createdAt_DESC,


        ){
            id
            title
            price
            description
            image
            largeImage
        }
    }

`;

const Center = styled.div`

    text-align:center;

`;

const ItemsList = styled.div`

display:grid;
grid-template-columns:1fr 1fr;
grid-gap:60px;
max-width:${props => props.theme.maxWidth};
margin:0 auto;

`;

class Items extends Component {
    render() {
        return (
            <Center>
                <Pagination page={this.props.page} />
                {/* <p>Items</p> */}
{/* Instead of making the Query Parameters as HOC ,
we are trying to use renderprops() ... here we are using Query component
and passing the query as props and then inside we have to write only a function,no
other component can go in between the Query tag */}
                <Query
                //this fetchPolicy="network-only" --> never hits Cache, always refers to the db, slow-->DONT USE
                // fetchPolicy="network-only"
                //use refetch queries instead on any mutation which will then tell particular queries to run again and then the cache is maintained/updated
                query={ALL_ITEMS_QUERY}
                variables={{
// This logic is suppose u are in page 1 -> then you get skip value as
//perPage =4
//1*4-4 ie. 0 , hence we dont skip anything ,
//on page 2 , 2*4-4 = 4 , skip first four
                    skip:this.props.page *perPage - perPage,
                    first:perPage,

                }
                }>
{/* destructure the payload returned by apollo */}
{/* {}--> indicates start of js and end of jsx */}
            {
                ({data,error,loading}) =>
                    {
                        if(loading) return <p>Loading...</p>

                        if(error) return <p>Error:{error.message}</p>

                        return <ItemsList>

                            {data.items.map(item =><Item item={item} key={item.id}  /> )  }

                        </ItemsList>
                    }
            }

                </Query>
                <Pagination page={this.props.page}/>

            </Center>
        );
    }
}

export default Items;
export {ALL_ITEMS_QUERY};