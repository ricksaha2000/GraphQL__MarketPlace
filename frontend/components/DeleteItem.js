import React, { Component } from 'react';
import {Mutation} from 'react-apollo';
import gql from 'graphql-tag';
import {ALL_ITEMS_QUERY} from './Items';
const DELETE_ITEM_MUTATION = gql`

    mutation DELETE_ITEM_MUTATION($id:ID!){
        deleteItem(id:$id){
            id
        }
    }

`;
class DeleteItem extends Component {

    update = (cache,payload) => {
        //cache contains the initially fetched Items in items page
        //manually update the cache so that it matches the actually prisma db after the deletion is performed
        //first read the cache for items
        //to get all items, we need graphql query ie. ALL_ITEMS_QUERY, which is exported like a boss
        const data = cache.readQuery({query:ALL_ITEMS_QUERY});
        console.log(data);
        //filter the deleted item out of the page
        data.items = data.items.filter(item => item.id!==payload.data.deleteItem.id);
        //Put the items back!
        cache.writeQuery({query:ALL_ITEMS_QUERY,data:data});
    }

    render() {
        return (
        <Mutation
        mutation={DELETE_ITEM_MUTATION}
        variables={
            {id:this.props.id}
            }
            update={this.update}
            >

            {(deleteItem,{error}) =>(

                <button onClick={() =>{
                    if(confirm('Are you sure u want to delete?'))
                    {
                        //it's a promise , so we can catch the error
                        deleteItem().catch(err =>{
                            alert(err.message);
                        });
                    }
                }}>
                    {this.props.children}
                </button>
            )}
            </Mutation>
        );
    }
}

export default DeleteItem;
export {DELETE_ITEM_MUTATION};