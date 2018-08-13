class Api::HomesController < ApplicationController

    def index 
        @homes = Home.all
    end

    def show
        @home = Home.find(params[:id])
    end

    def create

    end

    # def home_params
    #     params.require(:home).permit()
    # end
end
