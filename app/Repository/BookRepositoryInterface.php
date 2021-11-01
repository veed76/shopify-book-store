<?php

namespace App\Repository;
use Illuminate\Http\Request;

interface BookRepositoryInterface
{
    public function all($input);

    public function store(Request $request);

    public function show($id);

    public function edit($id);

    public function update(Request $request);
}
