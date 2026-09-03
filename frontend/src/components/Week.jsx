function Week({ isDisplayed, week, selectedDay, onSelectDay, handleAssign, handleClearWeek }) {

    return (
        <div className={isDisplayed ? "week" : "week hidden-mobile"}>
            <button id="clear-week" onClick={handleClearWeek}>Clear Week</button>
            <ul>
                {week.map((day => (<li key={day.day} className={selectedDay === day.day ? "day selected" : "day"} onClick={() => onSelectDay(day.day)}>
                    <h2>{day.day.slice(0, 3)}</h2>
                    <p>{day.meal ? day.meal : "+ Add Recipe"}</p>
                    {day.meal && <button className="unassign-button" onClick={(e) => {
                        e.stopPropagation();
                        handleAssign(day.day, null);
                    }}>X</button>}
                </li>)))}
            </ul>
        </div>
    )
}

export default Week;