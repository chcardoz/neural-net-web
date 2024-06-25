const Home: React.FC = () => {
    return (
        <div className="flex flex-col h-screen bg-gradient-to-b from-sky-300 p-4">
            <div className="p-2 flex-none">
                <p>NEURAL NET VISUALIZER</p>
            </div>
            <div className="bg-white p-5 rounded-lg shadow-lg flex-auto">
                <p>Your content goes here...</p>
            </div>

            <div
                id="floating-div"
                className="absolute bottom-4 bg-slate-50 border-dashed border-2 p-4 cursor-move"
            >
                Floating Div
            </div>
        </div>
    );
};

export default Home;
