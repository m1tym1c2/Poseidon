const TabBar = ({tabState}) => {
    const tabs= ['Search Tab','Checking Tab','Result Tab']
    const [activeTab, setActiveTab] = tabState;

    return (
        <div className="h-[5%] w-full flex flex-row border-b-2 border-blue-700">
            {
                tabs.map((tab, id) => {
                    const isSelected = tab === activeTab;
                    return (
                        <div key={id}
                            className={`w-[20%] h-full flex items-center justify-center cursor-pointer border-x-2 border-t-2 text-xl border-blue-600 rounded-lg ${
                                isSelected ? 'bg-blue-500 text-white' : 'bg-white text-blue-700'
                            }`}
                            onClick={() => {
                                setActiveTab(tab);
                                console.log(tab)
                            }}
                            onMouseEnter={(e) => e.currentTarget.classList.replace('bg-white', 'bg-blue-500')}
                            onMouseLeave={(e) => !isSelected && e.currentTarget.classList.replace('bg-blue-500', 'bg-white')}
                        >
                            {tab}
                        </div>
                    )
                })
            }
        </div>
    );
};

export default TabBar;