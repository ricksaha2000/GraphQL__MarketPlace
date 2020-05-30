import App , {Container} from 'next/app';
import Page from '../components/Page';
import {ApolloProvider} from 'react-apollo';
import withData from '../lib/withData';
class MyApp extends App{

    static async getInitialProps({Component,ctx}){

        let pageProps = {};
        if(Component.getInitialProps){
            //crawls throughout the page and gets all the query mutation
            //possibility in that page and resolved, before rendering the
            //pages, after this we return the page with all the query and mutation

            pageProps = await Component.getInitialProps(ctx);
        }
        //this exposes the query to the user on every page
        pageProps.query = ctx.query;
        return {pageProps};


    }

    render(){

        const {Component, apollo,pageProps} = this.props;
        return(
    <Container>
        <ApolloProvider client={apollo}>
            <Page>

                <Component {...pageProps} />


            </Page>

        </ApolloProvider>

    </Container>


        );
    }

}

export default withData(MyApp);