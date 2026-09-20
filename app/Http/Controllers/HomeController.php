<?php

namespace App\Http\Controllers;

use Illuminate\Contracts\View\View;

class HomeController extends Controller
{
    public function index(string $name): View
    {
        return view('home', [
            'applicationName' => 'WorkHub',
            'name' => $name,
        ]);
    }
}
