import { Frame, Loading, Card, Layout, Page, FormLayout, TextField, DisplayText, Stack, DropZone, Button, Form, Toast} from "@shopify/polaris";
import React, { useState, useEffect } from "react";
import {useHistory} from "react-router";
import {API} from "../utils/Api";
import isEmpty from "validator/es/lib/isEmpty";

const Create = (props) =>{
    const [book,setBook] = useState({
        name:'',
        price:'',
        compare_at:'',
        author:'',
        wholesale_price:'',
        description:'',
        no_of_pages:'',
        file:''
    });
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (props.editMode === true){
            handleEditBook(props.bookId)
        }
        $(".Polaris-Stack.Polaris-Stack--vertical img").css('display','none');
    }, [props.bookId]);


    const [showToast, setShowToast] = useState(false);
    const [isError, setIsError] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const history = useHistory();

    const handleChangeBook = (event) =>{
        setBook({
            ...book, [event.target.name]:event.target.value
        });
    }
    const handleDropZoneDrop = (file) => {
        setBook({
            ...book, ['file']:file[0]
        })
    }

    const validateInput = () =>{
        if(isEmpty(book.name)){
            setAlertMessage("Please enter valid book name");
            setIsError(true);
            setShowToast(true);
        }
    }

    const prepareFormData = () =>{
        const formData = new FormData();
        formData.append("name", book.name);
        formData.append("price", book.price);
        formData.append("compare_at", book.compare_at);
        formData.append("author", book.author);
        formData.append("wholesale_price", book.wholesale_price);
        formData.append("description", book.description);
        formData.append("image", book.file);
        formData.append("no_of_pages", book.no_of_pages);
        formData.append("shopify_product_id", props?.bookId);

        return formData;
    }
    const handleCreateBook = () => {
        let formData = prepareFormData();
        setIsLoading(true);
        API.post('/books/store',formData).then((response)=>{
            setAlertMessage(response.data.message);
            setIsLoading(false);
            setShowToast(true);
            history.push("/");
        }).catch((error)=>{
            if (error.response.status === 422){
                setAlertMessage(error.response.data.errors.name[0]);
                setIsError(true);
                setShowToast(true);
            }
        });
    }
    const handleToastDismiss = () => {
        setShowToast(false);
        setAlertMessage("");
        setIsError(false);
    };
    const handleUpdateBook = () => {
        let formData = prepareFormData();
        setIsLoading(true);
        API.post('/books/update',formData).then((response)=>{
            setAlertMessage(response.data.message);
            setShowToast(true);
            setIsLoading(false);
            (props.editMode)?props.setEditChange():'';
            // history.push("/");
        }).catch((error)=>{
            if (error.response.status === 422){
                setAlertMessage(error.response.data.errors.name[0]);
                setIsError(true);
                setShowToast(true);
            }
        });
    }

    const handleEditBook = (id) => {
        setIsLoading(true);
        API.get(`/books/edit/${id}`)
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
                { (showToast === true) ?
                    <Toast content={alertMessage} duration={2000} error={isError}  onDismiss={() => handleToastDismiss()} />

                    : null}
                <Layout.Section>
                    <Card sectioned>
                        <Form>
                        <FormLayout>
                            <Stack vertical={true} alignment="center">
                                <DisplayText size="extraLarge"> {props.editMode == true? "Edit" : "Create"} a Book</DisplayText>
                            </Stack>
                            <FormLayout.Group>
                                <TextField
                                    type="text"
                                    label="Book Name"
                                    value={book.name}
                                    name="name"
                                    onChange={() => handleChangeBook(event)}
                                    autoComplete="off"
                                />

                                <TextField
                                    type="number"
                                    label="Book Price"
                                    value={book.price}
                                    name="price"

                                    onChange={() => handleChangeBook(event)}
                                    autoComplete="off"
                                />
                                <TextField
                                    type="number"
                                    label="Book Compare At Price"
                                    value={book.compare_at}
                                    name="compare_at"
                                    onChange={() => handleChangeBook(event)}
                                    autoComplete="off"
                                />
                            </FormLayout.Group>

                            <FormLayout.Group>
                                <TextField
                                    type="number"
                                    label="Book Pages"
                                    value={book.no_of_pages?.toString()}
                                    name="no_of_pages"
                                    onChange={() => handleChangeBook(event)}
                                    autoComplete="off"
                                />
                                <TextField
                                    type="text"
                                    label="Book Author"
                                    value={book.author}
                                    name="author"
                                    onChange={() => handleChangeBook(event)}
                                    autoComplete="off"
                                />
                                <TextField
                                    type="number"
                                    label="Wholesale Price"
                                    value={book.wholesale_price?.toString()}
                                    name="wholesale_price"
                                    onChange={() => handleChangeBook(event)}
                                    autoComplete="off"
                                />
                            </FormLayout.Group>

                            <FormLayout.Group>
                                <TextField
                                    label="Book Description"
                                    multiline={4}
                                    value={book.description}
                                    name="description"
                                    maxHeight={150}
                                    onChange={() => handleChangeBook(event)}
                                    autoComplete="off"
                                />
                            </FormLayout.Group>
                            <FormLayout.Group>
                                <DropZone
                                    accept=".jpg,.jpeg,.png"
                                    errorOverlayText="File type must be image type"
                                    type="image"
                                    onDrop={handleDropZoneDrop}
                                    variableHeight
                                    allowMultiple={false}
                                >
                                    {/* {uploadedFiles} */}
                                    <DropZone.FileUpload />
                                </DropZone>
                            </FormLayout.Group>

                            <FormLayout.Group>
                                <Stack distribution={"trailing"}>
                                {
                                    props.editMode ?
                                        <Button onClick={handleUpdateBook}> Update </Button>
                                        :
                                        <Button onClick={handleCreateBook}> Create </Button>
                                }
                                <Button onClick={()=>{(props.editMode)?props.setEditChange():''; history.push('/');}}>Back</Button>
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
export default Create;
