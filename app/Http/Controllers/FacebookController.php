<?php
namespace App\Http\Controllers;

use App\Models\FacebookConnection;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class FacebookController extends Controller
{
    /**
     * Display the Facebook connection page.
     */
    public function index()
    {
        // Fetch all Facebook connections for the authenticated user
        $connections = FacebookConnection::where('user_id', Auth::id())->get();

        // Pass connections and Facebook App ID to the Inertia component
        return inertia('Facebook/Facebook', [
            'connections' => $connections->map(function ($connection) {
                return [
                    'id' => $connection->id,
                    'facebook_user_id' => $connection->facebook_user_id,
                    'facebook_user_name' => $connection->facebook_user_name,
                    'selected_page_id' => $connection->selected_page_id,
                    'selected_page_name' => $connection->selected_page_name,
                    'selected_page_picture' => $connection->selected_page_picture,
                    'page_access_token' => $connection->page_access_token,
                ];
            }),
            'facebookAppId' => env('FACEBOOK_APP_ID'),
        ]);
    }

    /**
     * Store a new Facebook connection.
     */
    public function store(Request $request)
    {
        $request->validate([
            'facebook_user_id' => 'required|string',
            'facebook_user_name' => 'required|string',
            'access_token' => 'required|string',
            'pages' => 'array',
        ]);

        // Update or create a connection
        $connection = FacebookConnection::updateOrCreate(
            [
                'user_id' => Auth::id(),
                'facebook_user_id' => $request->facebook_user_id,
            ],
            [
                'facebook_user_name' => $request->facebook_user_name,
                'access_token' => $request->access_token,
            ]
        );

        // Store the first page as the selected page if provided
        if ($request->has('pages') && !empty($request->pages)) {
            $page = $request->pages[0];
            $connection->update([
                'selected_page_id' => $page['id'],
                'selected_page_name' => $page['name'],
                'selected_page_picture' => $page['picture'] ?? 'https://via.placeholder.com/50',
                'page_access_token' => $page['access_token'] ?? null,
            ]);
        }

        return response()->json(['message' => 'Connection saved successfully']);
    }

    /**
     * Select a Facebook page for a connection.
     */
    public function selectPage(Request $request)
    {
        $request->validate([
            'facebook_user_id' => 'required|string',
            'page_id' => 'required|string',
            'page_name' => 'required|string',
            'page_picture' => 'nullable|string',
            'page_access_token' => 'nullable|string',
        ]);

        $connection = FacebookConnection::where('user_id', Auth::id())
            ->where('facebook_user_id', $request->facebook_user_id)
            ->firstOrFail();

        $connection->update([
            'selected_page_id' => $request->page_id,
            'selected_page_name' => $request->page_name,
            'selected_page_picture' => $request->page_picture ?? 'https://via.placeholder.com/50',
            'page_access_token' => $request->page_access_token,
        ]);

        return response()->json(['message' => 'Page selected successfully']);
    }

    /**
     * Disconnect a Facebook account.
     */
    public function disconnect($facebook_user_id)
    {
        $connection = FacebookConnection::where('user_id', Auth::id())
            ->where('facebook_user_id', $facebook_user_id)
            ->firstOrFail();

        $connection->delete();

        return response()->json(['message' => 'Disconnected successfully']);
    }
}
