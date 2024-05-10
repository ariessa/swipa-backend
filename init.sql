-- Create a database called swipa
CREATE DATABASE swipa;

-- Connect to swipa database
\c swipa

-- Create enum type called gender_type
CREATE TYPE gender_type AS ENUM ('f', 'm');

-- Create enum type called interest_type
CREATE TYPE interest_type AS ENUM (
'art',
'cooking_and_baking',
'diy_projects',
'fashion_and_style',
'fitness_and_wellness',
'games',
'history',
'movies_and_tv_shows',
'music',
'photography',
'sports',
'travel'
);

-- Instal uuid-ossp extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create a table called users
CREATE TABLE IF NOT EXISTS users (
id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
name VARCHAR(255) NOT NULL,
gender gender_type NOT NULL,
location VARCHAR(255) NOT NULL,
university VARCHAR(255) NOT NULL,
interests interest_type[] NOT NULL
);
