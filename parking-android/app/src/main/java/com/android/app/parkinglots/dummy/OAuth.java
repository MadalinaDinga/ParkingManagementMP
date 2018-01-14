package com.android.app.parkinglots.dummy;

public class OAuth {

    private static String current_token;

    public static String get_token() {
        return current_token;
    }

    public static void set_token(String token) {
        current_token = token;
    }

    private String access_token;

    public String getAccessToken() {
        return this.access_token;
    }

    public void setAccessToken(String access_token) {
        this.access_token = access_token;
    }

    private int expires_in;

    public int getExpiresIn() {
        return this.expires_in;
    }

    public void setExpiresIn(int expires_in) {
        this.expires_in = expires_in;
    }

    private String token_type;

    public String getTokenType() {
        return this.token_type;
    }

    public void setTokenType(String token_type) {
        this.token_type = token_type;
    }

    private String scope;

    public String getScope() {
        return this.scope;
    }

    public void setScope(String scope) {
        this.scope = scope;
    }

    private String refresh_token;

    public String getRefreshToken() {
        return this.refresh_token;
    }

    public void setRefreshToken(String refresh_token) {
        this.refresh_token = refresh_token;
    }
}

