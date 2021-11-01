<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreBookRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
            'name'               => "required|string",
            'price'              => "required|numeric",
            'compare_at'         => "required|numeric",
            'author'             => "required|string",
            'wholesale_price'    => "required|numeric",
            'description'        => "required",
            'no_of_pages'        => "required|integer",
            'shopify_product_id' => "required|numeric",
            'image'              => "required|image",
        ];
    }
}
