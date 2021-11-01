import {Frame, Loading, Card, Layout, Page, FormLayout, DisplayText, Stack, Button, Form, Toast} from "@shopify/polaris";
import React, { useState, useEffect } from "react";
import {useHistory} from "react-router";
import {API} from "../utils/Api";
import "./../../../css/app.css";

const View = (props) =>{
    const [book,setBook] = useState({
        name:'',
        price:'',
        compare_at:'',
        author:'',
        wholesale_price:'',
        description:'',
        no_of_pages:'',
        image:''
    });
    const [isLoading, setIsLoading] = useState(false);
    useEffect(() => {
        if (props.viewMode === true){
            handleViewBook(props.bookId)
        }
    }, [props.bookId]);

    const history = useHistory();


    const handleViewBook = (id) => {
        setIsLoading(true);
        API.get(`/books/show/${id}`)
            .then((response) => {
                setBook(response.data.data);
                setIsLoading(false);
            }).catch(error=>console.log(error));
    }

    return (
        <Page>
        {
            (isLoading)?
            <div style={{height: '100px'}}>
                <Frame>
                    <Loading />
                </Frame>
            </div>
            :null
        }
            <Layout>
                <Layout.Section>
                    <Card sectioned>
                        <Form>
                            <FormLayout>
                                <Stack vertical={true} alignment="center">
                                    <DisplayText size="extraLarge"> Book Details </DisplayText>
                                </Stack>
                                <table>
                                    <tbody>
                                        <tr>
                                            <th className="cellStyle"> Name </th>
                                            <td>{book.name}</td>
                                        </tr>
                                        <tr>
                                            <th className="cellStyle"> Author </th>
                                            <td>{book.author}</td>
                                        </tr>

                                        <tr>
                                            <th className="cellStyle"> Price </th>
                                            <td>{book.price}</td>
                                        </tr>

                                        <tr>
                                            <th className="cellStyle">Compare at Price</th>
                                            <td>{book.compare_at}</td>
                                        </tr>

                                        <tr>
                                            <th className="cellStyle"> Wholesale Price </th>
                                            <td>{book.wholesale_price}</td>
                                        </tr>
                                        <tr>
                                            <th className="cellStyle"> Pages </th>
                                            <td>{book.no_of_pages}</td>
                                        </tr>

                                        <tr>
                                            <th className="cellStyle"> Image </th>
                                            <td><img src={book.image} alt="Image" width={75} height={75}/></td>
                                        </tr>
                                        <tr>
                                            <th className="cellStyle"> Description </th>
                                            <td>
                                                <div style={{height:'150px',overflow:'auto'}}> {book.description.replace(/<[^>]+>/g, '')} </div> </td>
                                        </tr>
                                    </tbody>
                                </table>
                                <FormLayout.Group>
                                    <Stack distribution={"trailing"}>
                                        <Button onClick={()=>{(props.viewMode)?props.setViewChange():''; history.push('/');}}>Back</Button>
                                    </Stack>
                                </FormLayout.Group>
                            </FormLayout>
                        </Form>
                    </Card>
                </Layout.Section>
            </Layout>
        </Page>
    );
}
export default View;
