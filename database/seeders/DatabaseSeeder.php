<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use App\Models\Client;
use App\Models\Candidate;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
//        User::create([
//            'first_name' => 'Admin',
//            'last_name'  => 'Last',
//            'email'      => 'admin@app.com',
//            'password'   => Hash::make('12345678'),
//            'user_type'  => 'admin',
//            'status'     => true,
//        ]);
//
//        User::create([
//            'first_name' => 'User',
//            'last_name'  => 'Last',
//            'email'      => 'user@app.com',
//            'password'   => Hash::make('12345678'),
//            'user_type'  => 'user',
//            'status'     => true,
//        ]);
//
//        User::factory(5)->create();
//        Client::factory(3)->create();
//        Candidate::factory(10)->create();
    }
}
