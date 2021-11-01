import {useEffect, useState} from "react";
import {useHistory} from "react-router";
import {Frame, Loading, Card, DataTable, Layout, Page, Pagination, Button, Stack, TextStyle} from "@shopify/polaris";
import {API} from "../utils/Api";
import Create from "./Create";
import View from "./View";

const List = () => {
    const [books, setBooks] = useState([]);
    const [totalBooks, setTotalBooks] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [pageInfo,setPageInfo] = useState({
        previous:false,
        next:false,
    });
    const [page,setPage] = useState(1);
    const [showEdit,setShowEdit] = useState(false)
    const [showView,setShowView] = useState(false)
    const [editBookId,setEditBookId] = useState("")
    const [viewBookId,setViewBookId] = useState("")
    const history = useHistory();

    useEffect(()=>{
        getBooks();
    },[editBookId]);

    const getBooks = (url = '') => {
        if (page === undefined) {
            setPage(1);
        }
        setIsLoading(true);
        API.get(`/books/list?page_info=${url}`).then((response) => {
            setPageInfo({
                previous: response.data.page_info.previous,
                next: response.data.page_info.next
            });

            let data = response.data.products;
            setTotalBooks(response.data.total_products);
            let temp = [];
            if (Object.keys(data).length > 0) {
                Object.keys(data).map((pid,index) => {
                    temp.push([
                            data[pid].name,
                            data[pid].author,
                            data[pid].price,
                            <>
                            <Button onClick={() => handleEditBook(data[pid].shopify_product_id)} size="slim">Edit</Button>
                            <Button onClick={() => handleViewBook(data[pid].shopify_product_id)} size="slim">View</Button></>
                        ]);
                });
            }
            setBooks(temp);
            setIsLoading(false);
        }).catch((error)=>{
            console.log("Error :",error)
        });
    }

    const onPrevious = () => {
        if (pageInfo.previous) {
            setPageInfo({
                previous: false,
                next: false
            });
            setPage(page - 1);
            getBooks(pageInfo.previous);
        }
    };

    const onNext = () => {
        if (pageInfo.next) {
            setPageInfo({
                previous: false,
                next: false
            });
            setPage(page + 1);
            getBooks(pageInfo.next);
        }
    };

    const handleEditBook = (id) => {
        setShowEdit(true);
        setEditBookId(id)
    }

    const handleViewBook = (id) => {
        console.log("Id :",id);
        setShowView(true);
        setViewBookId(id);
    }
    return (
            (showView) ?
                <View viewMode={true} bookId={viewBookId} setViewChange={()=>{setShowView(!showView); getBooks(); }}/>
                    :
            (showEdit) ?
                <>
                    <Create editMode={true} bookId={editBookId} setEditChange={()=>{setShowEdit(!showEdit); getBooks(); }}/>
                </>
                :
            <Page fullWidth
                  primaryAction={{
                      content: 'Create Book',
                      onAction() {
                          history.push('/create');
                      }
                  }}
            >
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
                    <Card>
                        <Card.Section>
                            <Stack distribution={"trailing"}>
                                <TextStyle variation="strong"> Total Books :</TextStyle> <p> {totalBooks} </p>
                            </Stack>
                        </Card.Section>
                                <Card.Section>
                                    <DataTable
                                        columnContentTypes={[
                                            'text',
                                            'text',
                                            'numeric',
                                            'numeric',
                                        ]}
                                        headings={[
                                            'Book Name',
                                            'Author Name',
                                            'Price',
                                            'Action',
                                        ]}
                                        rows={books}
                                    />
                                </Card.Section>
                            <Card.Section>
                            <Pagination
                            hasPrevious={!!pageInfo.previous}
                            onPrevious={() => {onPrevious();}}
                            label={"Page :" + page}
                            hasNext={!!pageInfo.next}
                            onNext={() => {onNext();}}
                            />
                            </Card.Section>

                    </Card>
                </Layout.Section>
            </Layout>
        </Page>
    );
}
export default List;
