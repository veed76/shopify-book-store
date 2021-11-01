<?php

namespace App\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldBeUnique;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use App\Models\Book;
use App\Models\User;

class SyncShopifyProductJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public $shop_id;
    /**
     * Create a new job instance.
     *
     * @return void
     */
    public function __construct($shop_id)
    {
        $this->shop_id = $shop_id;
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle()
    {
        $shop = User::find($this->shop_id);
        $response = $shop->api()->rest('GET',"/admin/products.json",["limit" => 250]);
        $this->getProducts($shop, $response);
    }

    public function getProducts($shop, $response) {
        if(!$response['errors']){
            foreach ($response['body']->container['products'] as $item) {
                $product = Book::updateOrCreate(
                    [
                        'user_id' => $shop->id,
                        'shopify_product_id' => $item['id']
                    ],
                    [
                        'shopify_product_id' => $item['id'],
                    ]
                );
            }
            $nextPage = false;
            if($response['link'] != null)
                $nextPage = explode(";", $response['link']->container['next'])[0];
            if($nextPage){
                $response = $shop->api()->rest('GET',"/admin/products.json",["limit" => 250,'page_info'=>$nextPage]);
                $this->getProducts($shop, $response);
            }else{
                $shop->is_initially_synced = 1;
                $shop->save();
                return true;
            }
        }
    }
}
