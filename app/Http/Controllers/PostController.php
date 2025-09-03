<?php

namespace App\Http\Controllers;

//Import react
use Inertia\Inertia;

use App\Models\Post;
use Inertia\Response;

class PostController extends Controller
{
    //Method untuk memanggil halaman dashboard tabel post (index)
    public function index(): Response
    {
        return Inertia::render('posts',[
            'posts' => Post::all(),
        ]);
    }

}
