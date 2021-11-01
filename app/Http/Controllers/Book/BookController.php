<?php

namespace App\Http\Controllers\Book;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Repository\BookRepositoryInterface;
use App\Http\Requests\StoreBookRequest;

class BookController extends Controller
{

    public $bookRepo;

    public function __construct(BookRepositoryInterface $bookRepository)
    {
        $this->bookRepo = $bookRepository;
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $response = $this->bookRepo->all($request->all());
        return response($response);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        // Set the validation, name is required
        $request->validate([
            'name'=>"required"
        ]);
        $response = $this->bookRepo->store($request);
        return response($response['response_data'],$response['code']);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $response = $this->bookRepo->show($id);
        return response($response['response_data'],$response['code']);
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        $response = $this->bookRepo->edit($id);
        return response($response['response_data'],$response['code']);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request)
    {
        // Set the validations
        $request->validate([
            'name'=>"required"
        ]);
        $response = $this->bookRepo->update($request);
        return response($response['response_data'],$response['code']);
    }

}
