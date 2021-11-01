<?php

namespace App\Repository;
use App\Models\Book;
use Illuminate\Http\Request;

/**
 * Class BookRepository
 * @package App\Repository
 */

class BookRepository implements BookRepositoryInterface
{
    public function all($input)
    {
        $shop = \Auth::user();
        $parameters["limit"]= 5;
        $parameters["fields"]= "id,title,variants";

        $page_info = null;
        $get_db_products = [];
        if($input["page_info"] != "")
            $parameters["page_info"]= $input["page_info"];

        $response = $shop->api()->rest('GET','/admin/products.json' ,$parameters);
        $total_products = $shop->api()->rest('GET','/admin/products/count.json');

        if(!$response['errors']){
            $page_info = null;
            $page_info['next'] = $page_info['previous'] = false;
            if($response['link'] != null){
                if(isset($response['link']->container['next']))
                    $page_info['next'] = explode(";", $response['link']->container['next'])[0];

                if(isset($response['link']->container['previous']))
                    $page_info['previous'] = explode(";", $response['link']->container['previous'])[0];
            }

            $response = collect(@$response['body']['container']['products']);
            $get_db_products = Book::whereIn('shopify_product_id', $response->pluck('id'))->toBase()->get(['shopify_product_id', 'no_of_pages', 'author', 'wholesale_price']);

            $get_db_products = $get_db_products->keyBy('shopify_product_id');
            $response = collect($response->keyBy('id'));

            $get_db_products->map(function ($product, $key) use ($response, $get_db_products){
                $get_db_products[$key]->name = $response[$key]['title'];
                $get_db_products[$key]->price = $response[$key]['variants'][0]['price'];
            });
        }
        return ["page_info" => $page_info, "products" => $get_db_products, 'total_products'=>$total_products['body']['count']];
    }

    public function store(Request $request){
        $parameters['product']['title'] = $request->name;
        $parameters['product']['body_html'] = $request->description;
        $parameters['product']['variants'][0]['price'] = $request->price;
        $parameters['product']['variants'][0]['compare_at_price'] = $request->compare_at;
        if($request->hasFile('image'))
            $parameters['product']['images'][0]['attachment'] =  base64_encode(file_get_contents($request->file('image')));

        $shop = \Auth::user();
        $response = $shop->api()->rest('POST', "/admin/api/products.json", $parameters);

        if(!$response['errors']){
            $this->commonFunctionForStoring($response, $request, $shop);
            return [ "response_data" => ["message" => "Product Successfully Created"], "code" => 200];
        }else{
            // show error message
            return [ "response_data" => ["message" => "Something went wrong"], "code" => 400];
        }
    }

    public function show($id)
    {
        $book =  Book::where('shopify_product_id',$id)->first();
        $shop = \Auth::user();
        $parameters["fields"]= "id,title,variants,body_html,image";
        $response = $shop->api()->rest('GET', "/admin/api/products/" . $id . ".json", $parameters);
        $product = $response['body']['product'];
        $book->name = $product['title'];
        $book->description = $product['body_html'];
        $book->price = $product['variants'][0]['price'];
        $book->compare_at = $product['variants'][0]['compare_at_price'];
        $book->image = @$product['image']['src'];
        return [ "response_data" => ["data" => $book], "code" => 200];
    }

    public function edit($id)
    {
        $book =  Book::where('shopify_product_id',$id)->first();
        $shop = \Auth::user();
        $parameters["fields"]= "id,title,variants,body_html";
        $response = $shop->api()->rest('GET', "/admin/api/products/" . $id . ".json", $parameters);
        $product = $response['body']['product'];
        $book->name = $product['title'];
        $book->description = $product['body_html'];
        $book->price = $product['variants'][0]['price'];
        $book->compare_at = $product['variants'][0]['compare_at_price'];
        return [ "response_data" => ["data" => $book], "code" => 200];
    }

    public function update(Request $request)
    {
        $parameters['product']['title'] = $request->name;
        $parameters['product']['body_html'] = $request->description;
        $parameters['product']['variants'][0]['price'] = $request->price;
        $parameters['product']['variants'][0]['compare_at_price'] = $request->compare_at;
        if($request->hasFile('image')){
            $parameters['product']['images'][0]['attachment'] =  base64_encode(file_get_contents($request->file('image'))) ;
        }

        $shop = \Auth::user();
        $response = $shop->api()->rest('PUT', "/admin/api/products/" . $request->shopify_product_id . ".json", $parameters);
        if(!$response['errors']){
            $this->commonFunctionForStoring($response, $request, $shop);
            return [ "response_data" => ["message" => "Product Successfully Updated" ], "code" => 200];
        }else{
            // show error message
            return [ "response_data" => ["message" => "Something went wrong" ], "code" => 400];
        }
    }

    public function commonFunctionForStoring($response, $request, $shop ){
        $response = $response['body']['container']['product'];
        Book::updateOrCreate(
            [
                'user_id' => $shop->id,
                'shopify_product_id' => $response['id']
            ],
            [
                'no_of_pages' => nullToEmpty($request->no_of_pages, NULL),
                'author' => nullToEmpty($request->author, NULL),
                'wholesale_price' => nullToEmpty($request->wholesale_price,NULL),
            ]
        );
    }
}
