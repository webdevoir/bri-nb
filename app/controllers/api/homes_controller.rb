class Api::HomesController < ApplicationController

    def index 
        # @homes = Home.in_bounds(params[:bounds])
        @homes = Home.all
    end

    def show
        @home = Home.find(params[:id])
    end

    def create

    end
end
