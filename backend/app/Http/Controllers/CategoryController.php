<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class CategoryController extends Controller
{
    // Listar todas as categorias
    public function index()
    {
        $categories = Category::all();

        return response()->json($categories);
    }

    // Cadastrar uma categoria
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255', 'unique:categories,name'],
            'description' => ['nullable', 'string'],
            'status' => ['sometimes', 'boolean'],
        ]);

        $category = Category::create($validated);

        return response()->json($category, 201);
    }

    // Consultar uma categoria específica
    public function show(Category $category)
    {
        return response()->json($category);
    }

    // Atualizar uma categoria
    public function update(Request $request, Category $category)
    {
        $validated = $request->validate([
            'name' => [
                'sometimes',
                'required',
                'string',
                'max:255',
                Rule::unique('categories', 'name')->ignore($category->id),
            ],
            'description' => ['sometimes', 'nullable', 'string'],
            'status' => ['sometimes', 'boolean'],
        ]);

        $category->update($validated);

        return response()->json($category);
    }

    // Excluir uma categoria
    public function destroy(Category $category)
    {
        if ($category->products()->exists()) {
            return response()->json([
                'message' => 'Não é possível excluir uma categoria que possui produtos vinculados.',
            ], 409);
        }

        $category->delete();

        return response()->json([
            'message' => 'Categoria excluída com sucesso.',
        ]);
    }
}
